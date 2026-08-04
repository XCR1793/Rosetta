const appRoot = document.querySelector('.app');
const peopleListEl = document.getElementById('peopleList');
const editorForm = document.getElementById('editorForm');
const emptyEditor = document.getElementById('emptyEditor');
const saveStatus = document.getElementById('saveStatus');

const fieldName = document.getElementById('fieldName');
const fieldCountry = document.getElementById('fieldCountry');
const fieldState = document.getElementById('fieldState');
const fieldLocationTimezone = document.getElementById('fieldLocationTimezone');
const fieldManualTimezone = document.getElementById('fieldManualTimezone');
const fieldGmt = document.getElementById('fieldGmt');
const fieldCurrency = document.getElementById('fieldCurrency');
const currencyAutoBtn = document.getElementById('currencyAutoBtn');
const currencyHint = document.getElementById('currencyHint');
const fieldWake = document.getElementById('fieldWake');
const fieldSleep = document.getElementById('fieldSleep');
const fieldWorkStart = document.getElementById('fieldWorkStart');
const fieldWorkEnd = document.getElementById('fieldWorkEnd');
const schedulePreviewBands = document.getElementById('schedulePreviewBands');
const schedulePreviewHours = document.getElementById('schedulePreviewHours');
const schedulePreviewLabels = document.getElementById('schedulePreviewLabels');
const schedulePreviewMarker = document.getElementById('schedulePreviewMarker');

const timezoneFromLocationRow = document.getElementById('timezoneFromLocationRow');
const timezoneManualRow = document.getElementById('timezoneManualRow');
const gmtRow = document.getElementById('gmtRow');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');

const THEME_KEY = 'perch.theme';
const ACCENT_MODE_KEY = 'perch.accentMode';
const ACCENT_COLOR_KEY = 'perch.accentColor';
const SCALE_KEY = 'perch.scale';
const FALLBACK_ACCENT = '#0078d4';
const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';

let people = [];
let selectedId = null;
let options = { countries: [], allTimezones: [], gmtOffsets: [] };
let dirty = false;
let previewTickTimer = null;
let previewScaffoldReady = false;

function normalizeHex(value) {
  if (typeof value !== 'string') return FALLBACK_ACCENT;
  const match = value.trim().match(/^#?([0-9a-fA-F]{6})/);
  return match ? `#${match[1].toLowerCase()}` : FALLBACK_ACCENT;
}

function accentInkFor(hex) {
  const value = normalizeHex(hex).slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? '#1c1c20' : '#ffffff';
}

function readStoredScale() {
  const options = [75, 90, 100, 110, 125, 150];
  const raw = Number(localStorage.getItem(SCALE_KEY));
  if (!Number.isFinite(raw)) return 100;
  if (options.includes(raw)) return raw;
  return options.reduce((best, option) =>
    Math.abs(option - raw) < Math.abs(best - raw) ? option : best
  , 100);
}

function applyShellTheme() {
  const theme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  appRoot.dataset.theme = theme;
  window.electronAPI.setBackgroundColor(isDark ? '#111212' : '#fefefe');
  window.electronAPI.setZoomFactor(readStoredScale() / 100);

  const accentMode = localStorage.getItem(ACCENT_MODE_KEY) === 'manual' ? 'manual' : 'auto';
  if (accentMode === 'manual') {
    const accent = normalizeHex(localStorage.getItem(ACCENT_COLOR_KEY) || FALLBACK_ACCENT);
    appRoot.style.setProperty('--accent', accent);
    appRoot.style.setProperty('--accent-ink', accentInkFor(accent));
    return;
  }

  window.electronAPI.getSystemAccentColor().then((accent) => {
    const color = normalizeHex(accent || FALLBACK_ACCENT);
    appRoot.style.setProperty('--accent', color);
    appRoot.style.setProperty('--accent-ink', accentInkFor(color));
  });
}

function selectedPerson() {
  return people.find((p) => p.id === selectedId) || null;
}

function setDirty(next = true) {
  dirty = next;
  saveStatus.textContent = dirty ? 'Unsaved changes' : 'Saved';
}

function fillSelect(select, items, getValue = (v) => v, getLabel = (v) => v) {
  const current = select.value;
  select.innerHTML = '';
  for (const item of items) {
    const option = document.createElement('option');
    option.value = String(getValue(item));
    option.textContent = getLabel(item);
    select.appendChild(option);
  }
  if ([...select.options].some((o) => o.value === current)) {
    select.value = current;
  }
}

async function refreshStates(country, preferredState = '') {
  const states = await window.electronAPI.getStates(country);
  fillSelect(fieldState, ['', ...states], (v) => v, (v) => v || '—');
  if (preferredState && states.includes(preferredState)) {
    fieldState.value = preferredState;
  } else if (!states.includes(fieldState.value)) {
    fieldState.value = '';
  }
}

async function refreshLocationTimezones(country, state, preferred = '') {
  const zones = await window.electronAPI.getTimezonesForLocation(country, state);
  fillSelect(fieldLocationTimezone, zones);
  if (preferred && zones.includes(preferred)) {
    fieldLocationTimezone.value = preferred;
  } else if (!zones.includes(fieldLocationTimezone.value) && zones[0]) {
    fieldLocationTimezone.value = zones[0];
  }
}

function updateTimezoneModeUi(mode) {
  document.querySelectorAll('[data-tz-mode]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tzMode === mode);
  });
  timezoneFromLocationRow.hidden = mode !== 'location';
  timezoneManualRow.hidden = mode !== 'timezone';
  gmtRow.hidden = mode !== 'gmt';
}

async function syncCurrencyFromCountry(person) {
  if (person.currencyMode !== 'auto') return;
  const detected = await window.electronAPI.getCurrencyForCountry(person.country);
  person.currency = detected || person.currency || '';
  fieldCurrency.value = person.currency || '';
  currencyHint.textContent = detected
    ? `Auto-detected: ${detected}`
    : 'No currency mapped for this country';
}

function ensurePreviewScaffold() {
  if (previewScaffoldReady) return;
  schedulePreviewHours.innerHTML = '';
  schedulePreviewLabels.innerHTML = '';

  for (let hour = 0; hour < 24; hour += 1) {
    const tick = document.createElement('span');
    tick.className = `timeline__hour${hour % 3 === 0 ? ' timeline__hour--major' : ''}`;
    tick.style.left = `${(hour / 24) * 100}%`;
    tick.setAttribute('aria-hidden', 'true');
    schedulePreviewHours.appendChild(tick);
  }

  for (let hour = 0; hour < 24; hour += 3) {
    const label = document.createElement('span');
    label.className = 'timeline__label' + (hour === 0 ? ' timeline__label--start' : '');
    label.style.left = `${(hour / 24) * 100}%`;
    label.textContent = PerchSchedule.formatHourLabel(hour);
    schedulePreviewLabels.appendChild(label);
  }

  previewScaffoldReady = true;
}

function readScheduleFromFields() {
  return PerchSchedule.normalizeSchedule({
    wakeTime: fieldWake.value,
    sleepTime: fieldSleep.value,
    workStart: fieldWorkStart.value,
    workEnd: fieldWorkEnd.value
  });
}

function renderScheduleBands(container, schedule) {
  container.innerHTML = '';
  const bands = PerchSchedule.scheduleBands(schedule);

  for (const range of bands.sleep) {
    const band = document.createElement('div');
    band.className = 'timeline__band timeline__band--sleep';
    band.style.left = `${range.start * 100}%`;
    band.style.width = `${(range.end - range.start) * 100}%`;
    container.appendChild(band);
  }

  for (const range of bands.work) {
    const band = document.createElement('div');
    band.className = 'timeline__band timeline__band--work';
    band.style.left = `${range.start * 100}%`;
    band.style.width = `${(range.end - range.start) * 100}%`;
    container.appendChild(band);
  }
}

function getPreviewProgress(person) {
  const zone = person?.resolvedTimezone || person?.timezone;
  if (!zone) {
    const now = new Date();
    return (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date()).map((part) => [part.type, part.value])
    );
    return (
      (Number(parts.hour || 0) * 3600 +
        Number(parts.minute || 0) * 60 +
        Number(parts.second || 0)) /
      86400
    );
  } catch (_) {
    const now = new Date();
    return (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  }
}

function updateSchedulePreview(person = selectedPerson()) {
  ensurePreviewScaffold();
  const schedule = person
    ? PerchSchedule.normalizeSchedule(person)
    : readScheduleFromFields();
  renderScheduleBands(schedulePreviewBands, schedule);
  schedulePreviewMarker.style.left = `${getPreviewProgress(person) * 100}%`;
}

function applyScheduleToFields(person) {
  const schedule = PerchSchedule.normalizeSchedule(person || {});
  fieldWake.value = schedule.wakeTime;
  fieldSleep.value = schedule.sleepTime;
  fieldWorkStart.value = schedule.workStart;
  fieldWorkEnd.value = schedule.workEnd;
}

function writeScheduleToPerson(person) {
  const schedule = readScheduleFromFields();
  person.wakeTime = schedule.wakeTime;
  person.sleepTime = schedule.sleepTime;
  person.workStart = schedule.workStart;
  person.workEnd = schedule.workEnd;
}

function onScheduleFieldChange() {
  const person = selectedPerson();
  if (!person) return;
  writeScheduleToPerson(person);
  setDirty(true);
  updateSchedulePreview(person);
}

function renderPeopleList() {
  peopleListEl.innerHTML = '';
  people.forEach((person) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `person-item${person.id === selectedId ? ' active' : ''}`;
    btn.innerHTML = `
      <span class="person-item__name"></span>
      <span class="person-item__meta"></span>
    `;
    btn.querySelector('.person-item__name').textContent = person.name;
    btn.querySelector('.person-item__meta').textContent = [
      person.state,
      person.country,
      person.resolvedTimezone || person.timezone
    ]
      .filter(Boolean)
      .join(' · ');
    btn.addEventListener('click', () => selectPerson(person.id));
    peopleListEl.appendChild(btn);
  });
}

async function populateEditor(person) {
  if (!person) {
    editorForm.hidden = true;
    emptyEditor.hidden = false;
    return;
  }

  emptyEditor.hidden = true;
  editorForm.hidden = false;

  fieldName.value = person.name || '';
  fieldCountry.value = person.country || options.countries[0] || '';
  await refreshStates(fieldCountry.value, person.state || '');
  await refreshLocationTimezones(
    fieldCountry.value,
    fieldState.value,
    person.timezone || ''
  );

  fillSelect(fieldManualTimezone, options.allTimezones);
  if (person.timezone) fieldManualTimezone.value = person.timezone;

  fillSelect(
    fieldGmt,
    options.gmtOffsets,
    (o) => o.value,
    (o) => o.label
  );
  if (Number.isFinite(Number(person.gmtOffset))) {
    fieldGmt.value = String(person.gmtOffset);
  } else {
    fieldGmt.value = '0';
  }

  updateTimezoneModeUi(person.timezoneMode || 'location');
  currencyAutoBtn.setAttribute('aria-pressed', String(person.currencyMode !== 'manual'));
  fieldCurrency.readOnly = person.currencyMode !== 'manual';
  fieldCurrency.value = person.currency || '';
  currencyHint.textContent =
    person.currencyMode === 'manual'
      ? 'Manual currency'
      : `Auto-detected: ${person.currency || '—'}`;

  applyScheduleToFields(person);
  updateSchedulePreview(person);
}

function readEditorIntoPerson(person) {
  person.name = fieldName.value.trim() || 'Person';
  person.country = fieldCountry.value;
  person.state = fieldState.value;
  person.timezoneMode =
    document.querySelector('[data-tz-mode].active')?.dataset.tzMode || 'location';

  if (person.timezoneMode === 'location') {
    person.timezone = fieldLocationTimezone.value;
    person.gmtOffset = null;
  } else if (person.timezoneMode === 'timezone') {
    person.timezone = fieldManualTimezone.value;
    person.gmtOffset = null;
  } else {
    person.gmtOffset = Number(fieldGmt.value);
    person.timezone = null;
  }

  person.currencyMode =
    currencyAutoBtn.getAttribute('aria-pressed') === 'true' ? 'auto' : 'manual';
  person.currency = fieldCurrency.value.trim().toUpperCase() || null;
  writeScheduleToPerson(person);
}

async function selectPerson(id) {
  const current = selectedPerson();
  if (current && !editorForm.hidden) {
    readEditorIntoPerson(current);
  }
  selectedId = id;
  renderPeopleList();
  await populateEditor(selectedPerson());
}

async function addPerson() {
  const current = selectedPerson();
  if (current && !editorForm.hidden) readEditorIntoPerson(current);

  const id = await window.electronAPI.createPersonId();
  const country = options.countries.includes('Australia')
    ? 'Australia'
    : options.countries[0] || '';
  const states = await window.electronAPI.getStates(country);
  const state = states[0] || '';
  const zones = await window.electronAPI.getTimezonesForLocation(country, state);
  const currency = await window.electronAPI.getCurrencyForCountry(country);

  const person = {
    id,
    name: 'New person',
    country,
    state,
    timezoneMode: 'location',
    timezone: zones[0] || 'UTC',
    gmtOffset: null,
    currencyMode: 'auto',
    currency: currency || null,
    ...PerchSchedule.DEFAULT_SCHEDULE
  };

  people.push(person);
  setDirty(true);
  await selectPerson(id);
}

function deleteSelected() {
  if (!selectedId) return;
  people = people.filter((p) => p.id !== selectedId);
  selectedId = people[0]?.id || null;
  setDirty(true);
  renderPeopleList();
  populateEditor(selectedPerson());
}

async function savePeople() {
  const current = selectedPerson();
  if (current && !editorForm.hidden) {
    readEditorIntoPerson(current);
    if (current.currencyMode === 'auto') {
      await syncCurrencyFromCountry(current);
    }
  }

  people = await window.electronAPI.savePeople(people);
  setDirty(false);
  renderPeopleList();
  await populateEditor(selectedPerson());
  saveStatus.textContent = 'Saved to people.yaml';
}

function setMaximizedUi(maximized) {
  maximizeIcon.textContent = maximized ? GLYPH_RESTORE : GLYPH_MAXIMIZE;
  maximizeBtn.title = maximized ? 'Restore' : 'Maximize';
  maximizeBtn.setAttribute('aria-label', maximized ? 'Restore' : 'Maximize');
}

document.getElementById('minimizeBtn').addEventListener('click', () => {
  window.electronAPI.minimize();
});
maximizeBtn.addEventListener('click', () => {
  window.electronAPI.maximizeToggle();
});
document.getElementById('closeBtn').addEventListener('click', () => {
  window.electronAPI.close();
});
document.getElementById('addPersonBtn').addEventListener('click', addPerson);
document.getElementById('deletePersonBtn').addEventListener('click', deleteSelected);
document.getElementById('saveBtn').addEventListener('click', savePeople);

fieldName.addEventListener('input', () => {
  const person = selectedPerson();
  if (!person) return;
  person.name = fieldName.value;
  setDirty(true);
  renderPeopleList();
});

fieldCountry.addEventListener('change', async () => {
  const person = selectedPerson();
  if (!person) return;
  person.country = fieldCountry.value;
  await refreshStates(person.country, '');
  person.state = fieldState.value;
  await refreshLocationTimezones(person.country, person.state, '');
  person.timezone = fieldLocationTimezone.value;
  if (person.currencyMode === 'auto') {
    await syncCurrencyFromCountry(person);
  }
  setDirty(true);
  renderPeopleList();
});

fieldState.addEventListener('change', async () => {
  const person = selectedPerson();
  if (!person) return;
  person.state = fieldState.value;
  await refreshLocationTimezones(person.country, person.state, person.timezone || '');
  if (person.timezoneMode === 'location') {
    person.timezone = fieldLocationTimezone.value;
  }
  setDirty(true);
  renderPeopleList();
});

fieldLocationTimezone.addEventListener('change', () => {
  const person = selectedPerson();
  if (!person) return;
  person.timezone = fieldLocationTimezone.value;
  setDirty(true);
  renderPeopleList();
  updateSchedulePreview(person);
});

fieldManualTimezone.addEventListener('change', () => {
  const person = selectedPerson();
  if (!person) return;
  person.timezone = fieldManualTimezone.value;
  setDirty(true);
  renderPeopleList();
  updateSchedulePreview(person);
});

fieldGmt.addEventListener('change', () => {
  const person = selectedPerson();
  if (!person) return;
  person.gmtOffset = Number(fieldGmt.value);
  setDirty(true);
  renderPeopleList();
  updateSchedulePreview(person);
});

document.querySelectorAll('[data-tz-mode]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const person = selectedPerson();
    if (!person) return;
    person.timezoneMode = btn.dataset.tzMode;
    updateTimezoneModeUi(person.timezoneMode);
    if (person.timezoneMode === 'location') {
      await refreshLocationTimezones(person.country, person.state, person.timezone || '');
      person.timezone = fieldLocationTimezone.value;
      person.gmtOffset = null;
    } else if (person.timezoneMode === 'timezone') {
      if (!person.timezone) person.timezone = fieldManualTimezone.value;
      fieldManualTimezone.value = person.timezone;
      person.gmtOffset = null;
    } else if (!Number.isFinite(Number(person.gmtOffset))) {
      person.gmtOffset = 0;
      fieldGmt.value = '0';
    }
    setDirty(true);
    renderPeopleList();
    updateSchedulePreview(person);
  });
});

currencyAutoBtn.addEventListener('click', async () => {
  const person = selectedPerson();
  if (!person) return;
  person.currencyMode = 'auto';
  currencyAutoBtn.setAttribute('aria-pressed', 'true');
  fieldCurrency.readOnly = true;
  await syncCurrencyFromCountry(person);
  setDirty(true);
});

fieldCurrency.addEventListener('input', () => {
  const person = selectedPerson();
  if (!person) return;
  person.currencyMode = 'manual';
  currencyAutoBtn.setAttribute('aria-pressed', 'false');
  fieldCurrency.readOnly = false;
  person.currency = fieldCurrency.value.trim().toUpperCase();
  currencyHint.textContent = 'Manual currency';
  setDirty(true);
});

[fieldWake, fieldSleep, fieldWorkStart, fieldWorkEnd].forEach((input) => {
  input.addEventListener('input', onScheduleFieldChange);
  input.addEventListener('change', onScheduleFieldChange);
});

window.electronAPI.onSystemAccentColorChange((color) => {
  if (localStorage.getItem(ACCENT_MODE_KEY) === 'manual') return;
  const accent = normalizeHex(color || FALLBACK_ACCENT);
  appRoot.style.setProperty('--accent', accent);
  appRoot.style.setProperty('--accent-ink', accentInkFor(accent));
});

window.electronAPI.onPeopleUpdated((next) => {
  if (dirty) return;
  people = Array.isArray(next) ? next : [];
  if (!people.some((p) => p.id === selectedId)) {
    selectedId = people[0]?.id || null;
  }
  renderPeopleList();
  populateEditor(selectedPerson());
});

applyShellTheme();
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);

(async function init() {
  options = await window.electronAPI.getLocationOptions();
  fillSelect(fieldCountry, options.countries);
  fillSelect(fieldManualTimezone, options.allTimezones);
  fillSelect(fieldGmt, options.gmtOffsets, (o) => o.value, (o) => o.label);

  people = await window.electronAPI.getPeople();
  selectedId = people[0]?.id || null;
  renderPeopleList();
  await populateEditor(selectedPerson());
  setDirty(false);

  if (previewTickTimer) clearInterval(previewTickTimer);
  previewTickTimer = setInterval(() => {
    if (!editorForm.hidden) updateSchedulePreview(selectedPerson());
  }, 1000);
})();
