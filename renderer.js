const settingsBtn = document.getElementById('settingsBtn');
const titleLabel = document.getElementById('titleLabel');
const homeView = document.getElementById('homeView');
const settingsView = document.getElementById('settingsView');
const peopleTimelines = document.getElementById('peopleTimelines');
const themeSwitch = document.getElementById('themeSwitch');
const themeHint = document.getElementById('themeHint');
const accentAutoBtn = document.getElementById('accentAutoBtn');
const accentColorInput = document.getElementById('accentColorInput');
const accentSwatchFill = document.getElementById('accentSwatchFill');
const accentHint = document.getElementById('accentHint');
const scaleSelect = document.getElementById('scaleSelect');
const scaleHint = document.getElementById('scaleHint');
const hourFormatHint = document.getElementById('hourFormatHint');
const hourFormat12Btn = document.getElementById('hourFormat12Btn');
const hourFormat24Btn = document.getElementById('hourFormat24Btn');
const appRoot = document.querySelector('.app');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');

const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';
const THEME_KEY = 'perch.theme';
const ACCENT_MODE_KEY = 'perch.accentMode';
const ACCENT_COLOR_KEY = 'perch.accentColor';
const SCALE_KEY = 'perch.scale';
const HOUR_FORMAT_KEY = 'perch.hourFormat';
const SYNC_ENABLED_KEY = 'perch.syncEnabled';
const SYNC_PERSON_KEY = 'perch.syncPersonId';
const FALLBACK_ACCENT = '#0078d4';
const SCALE_OPTIONS = [75, 90, 100, 110, 125, 150];

let currentView = 'home';
let theme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
let accentMode = localStorage.getItem(ACCENT_MODE_KEY) === 'manual' ? 'manual' : 'auto';
let manualAccent = normalizeHex(localStorage.getItem(ACCENT_COLOR_KEY) || FALLBACK_ACCENT);
let activeAccent = FALLBACK_ACCENT;
let scalePercent = readStoredScale();
let hourFormat = localStorage.getItem(HOUR_FORMAT_KEY) === '12' ? '12' : '24';
let syncEnabled = localStorage.getItem(SYNC_ENABLED_KEY) === 'true';
let syncPersonId = localStorage.getItem(SYNC_PERSON_KEY) || '';
let people = [];
let tickTimer = null;

function normalizeHex(value) {
  if (typeof value !== 'string') return FALLBACK_ACCENT;
  const match = value.trim().match(/^#?([0-9a-fA-F]{6})/);
  return match ? `#${match[1].toLowerCase()}` : FALLBACK_ACCENT;
}

function readStoredScale() {
  const raw = Number(localStorage.getItem(SCALE_KEY));
  if (!Number.isFinite(raw)) return 100;
  if (SCALE_OPTIONS.includes(raw)) return raw;

  // Snap legacy slider values to the nearest dropdown option.
  return SCALE_OPTIONS.reduce((best, option) =>
    Math.abs(option - raw) < Math.abs(best - raw) ? option : best
  , 100);
}

function setScale(percent) {
  const next = Number(percent);
  scalePercent = SCALE_OPTIONS.includes(next) ? next : 100;
  localStorage.setItem(SCALE_KEY, String(scalePercent));
  window.electronAPI.setZoomFactor(scalePercent / 100);
  scaleSelect.value = String(scalePercent);
  scaleHint.textContent = scalePercent === 100 ? 'Default' : `${scalePercent}%`;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatClockTime(hours, minutes, seconds) {
  if (hourFormat === '12') {
    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${pad2(minutes)}:${pad2(seconds)} ${period}`;
  }
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

function setHourFormat(format) {
  hourFormat = format === '12' ? '12' : '24';
  localStorage.setItem(HOUR_FORMAT_KEY, hourFormat);
  hourFormat12Btn.classList.toggle('active', hourFormat === '12');
  hourFormat24Btn.classList.toggle('active', hourFormat === '24');
  hourFormatHint.textContent = hourFormat === '12' ? '12-hour' : '24-hour';
  refreshTimelineLabelText();
  updateTimelineCards();
}

function ensureSyncTarget() {
  if (!people.length) {
    syncEnabled = false;
    syncPersonId = '';
    localStorage.setItem(SYNC_ENABLED_KEY, 'false');
    localStorage.setItem(SYNC_PERSON_KEY, '');
    return;
  }

  if (!people.some((person) => person.id === syncPersonId)) {
    syncPersonId = people[0].id;
    localStorage.setItem(SYNC_PERSON_KEY, syncPersonId);
  }

  if (syncEnabled) {
    localStorage.setItem(SYNC_ENABLED_KEY, 'true');
  }
}

function setSyncEnabled(enabled) {
  syncEnabled = Boolean(enabled) && people.length > 0;
  localStorage.setItem(SYNC_ENABLED_KEY, String(syncEnabled));
  updateTimelineCards();
}

function toggleSyncForPerson(id) {
  if (!people.some((person) => person.id === id)) return;

  if (syncEnabled && syncPersonId === id) {
    setSyncEnabled(false);
    return;
  }

  syncPersonId = id;
  localStorage.setItem(SYNC_PERSON_KEY, syncPersonId);
  setSyncEnabled(true);
}

function getZoneProgress(timeZone) {
  try {
    return getZonedParts(timeZone).progress;
  } catch (_) {
    return getZonedParts('UTC').progress;
  }
}

function getSyncReferenceProgress() {
  if (!syncEnabled || !people.length) return null;
  const reference =
    people.find((person) => person.id === syncPersonId) || people[0];
  if (!reference) return null;
  const zone = reference.resolvedTimezone || reference.timezone || 'UTC';
  return getZoneProgress(zone);
}

/** Shift so this person's now lines up with the reference marker (looping). */
function timelineShiftFor(progress, referenceProgress) {
  if (referenceProgress == null) return 0;
  return PerchSchedule.wrapUnit(progress - referenceProgress);
}

function accentInkFor(hex) {
  const value = normalizeHex(hex).slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? '#1c1c20' : '#ffffff';
}

function setView(view) {
  currentView = view;
  const inSettings = view === 'settings';

  homeView.hidden = inSettings;
  settingsView.hidden = !inSettings;
  settingsBtn.classList.toggle('active', inSettings);
  titleLabel.textContent = inSettings ? 'Settings' : '';
}

function setTheme(nextTheme) {
  theme = nextTheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  appRoot.dataset.theme = theme;
  themeSwitch.setAttribute('aria-checked', String(isDark));
  themeHint.textContent = isDark ? 'Dark mode' : 'Light mode';
  localStorage.setItem(THEME_KEY, theme);
  window.electronAPI.setBackgroundColor(isDark ? '#111212' : '#fefefe');
}

function applyAccent(color) {
  activeAccent = normalizeHex(color);
  appRoot.style.setProperty('--accent', activeAccent);
  appRoot.style.setProperty('--accent-ink', accentInkFor(activeAccent));
  accentColorInput.value = activeAccent;
  accentSwatchFill.style.background = activeAccent;
  accentAutoBtn.setAttribute('aria-pressed', String(accentMode === 'auto'));
  accentHint.textContent = accentMode === 'auto' ? 'Auto' : 'Manual';
}

async function refreshSystemAccent() {
  try {
    const systemAccent = await window.electronAPI.getSystemAccentColor();
    applyAccent(systemAccent || FALLBACK_ACCENT);
  } catch (e) {
    applyAccent(FALLBACK_ACCENT);
  }
}

async function setAccentMode(mode, color) {
  accentMode = mode === 'manual' ? 'manual' : 'auto';
  localStorage.setItem(ACCENT_MODE_KEY, accentMode);

  if (accentMode === 'manual') {
    manualAccent = normalizeHex(color || manualAccent || activeAccent);
    localStorage.setItem(ACCENT_COLOR_KEY, manualAccent);
    applyAccent(manualAccent);
    return;
  }

  await refreshSystemAccent();
}

function setMaximizedUi(maximized) {
  maximizeIcon.textContent = maximized ? GLYPH_RESTORE : GLYPH_MAXIMIZE;
  maximizeBtn.title = maximized ? 'Restore' : 'Maximize';
  maximizeBtn.setAttribute('aria-label', maximized ? 'Restore' : 'Maximize');
}

function getZonedParts(timeZone) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(new Date()).map((part) => [part.type, part.value])
  );

  const hours = Number(parts.hour || 0);
  const minutes = Number(parts.minute || 0);
  const seconds = Number(parts.second || 0);
  const dayFraction = (hours * 3600 + minutes * 60 + seconds) / 86400;

  return {
    time: formatClockTime(hours, minutes, seconds),
    date: `${parts.day} ${parts.month}`,
    // Looping marker: 0..1 wraps naturally each midnight
    progress: ((dayFraction % 1) + 1) % 1
  };
}

function formatHourLabel(hour) {
  if (hourFormat === '24') return pad2(hour);
  return PerchSchedule.formatHourLabel(hour);
}

function refreshTimelineLabelText() {
  peopleTimelines.querySelectorAll('.timeline__label').forEach((label) => {
    const hour = Number(label.dataset.hour);
    if (Number.isFinite(hour)) label.textContent = formatHourLabel(hour);
  });
}

function personSchedule(person) {
  return PerchSchedule.normalizeSchedule(person || {});
}

function renderScheduleBands(container, schedule, shift = 0) {
  if (!container) return;
  container.innerHTML = '';
  const bands = PerchSchedule.scheduleBands(schedule, shift);

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

function applyTrackShift(trackStrip, shift) {
  if (!trackStrip) return;
  // 200%-wide dual day strip: negative left reveals later hours (loops into copy 2).
  trackStrip.style.left = `${-PerchSchedule.wrapUnit(shift) * 100}%`;
}

function applyTimelineShift(card, shift) {
  card.querySelectorAll('.timeline__hour').forEach((tick) => {
    const hour = Number(tick.dataset.hour);
    const visual = PerchSchedule.wrapUnit(hour / 24 - shift);
    tick.style.left = `${visual * 100}%`;
  });

  card.querySelectorAll('.timeline__label').forEach((label) => {
    const hour = Number(label.dataset.hour);
    const visual = PerchSchedule.wrapUnit(hour / 24 - shift);
    label.style.left = `${visual * 100}%`;
    label.classList.toggle('timeline__label--start', visual < 0.035);
    label.textContent = formatHourLabel(hour);
  });

  applyTrackShift(card.querySelector('.timeline__track-strip'), shift);
  renderScheduleBands(
    card.querySelector('.timeline__schedule'),
    cardSchedule(card),
    PerchSchedule.wrapUnit(-shift)
  );
}

function fillTimelineScaffold(hoursEl, labelsEl) {
  hoursEl.innerHTML = '';
  labelsEl.innerHTML = '';

  for (let hour = 0; hour < 24; hour += 1) {
    const tick = document.createElement('span');
    tick.className = `timeline__hour${hour % 3 === 0 ? ' timeline__hour--major' : ''}`;
    tick.dataset.hour = String(hour);
    tick.style.left = `${(hour / 24) * 100}%`;
    tick.setAttribute('aria-hidden', 'true');
    hoursEl.appendChild(tick);
  }

  for (let hour = 0; hour < 24; hour += 3) {
    const label = document.createElement('span');
    label.className = 'timeline__label' + (hour === 0 ? ' timeline__label--start' : '');
    label.dataset.hour = String(hour);
    label.style.left = `${(hour / 24) * 100}%`;
    label.textContent = formatHourLabel(hour);
    labelsEl.appendChild(label);
  }
}

function ensureTimelineCards() {
  const existing = new Map(
    [...peopleTimelines.querySelectorAll('.person-card')].map((card) => [
      card.dataset.id,
      card
    ])
  );

  peopleTimelines.innerHTML = '';

  people.forEach((person) => {
    let card = existing.get(person.id);
    if (card && !card.querySelector('button.person-card__name')) {
      card = null;
    }
    if (!card) {
      card = document.createElement('article');
      card.className = 'person-card';
      card.innerHTML = `
        <button class="person-card__name" type="button"></button>
        <div class="timeline-block">
          <div class="timeline neo-surface neo-surface--dip neo-surface--pill">
            <div class="timeline__track"><div class="timeline__track-strip"></div></div>
            <div class="timeline__schedule"></div>
            <div class="timeline__hours"></div>
            <div class="timeline__marker"></div>
          </div>
          <div class="timeline__labels"></div>
        </div>
        <div class="person-card__meta">
          <div class="person-card__time"></div>
          <div class="person-card__date"></div>
        </div>
      `;

      fillTimelineScaffold(
        card.querySelector('.timeline__hours'),
        card.querySelector('.timeline__labels')
      );

      card.querySelector('.person-card__name').addEventListener('click', () => {
        toggleSyncForPerson(card.dataset.id);
      });
    }

    card.dataset.id = person.id;
    card.dataset.timezone = person.resolvedTimezone || person.timezone || 'UTC';
    const schedule = personSchedule(person);
    card.dataset.wakeTime = schedule.wakeTime;
    card.dataset.sleepTime = schedule.sleepTime;
    card.dataset.workStart = schedule.workStart;
    card.dataset.workEnd = schedule.workEnd;
    const nameBtn = card.querySelector('.person-card__name');
    nameBtn.textContent = person.name;
    nameBtn.title = 'Click to sync timelines to this person';
    nameBtn.setAttribute(
      'aria-pressed',
      String(syncEnabled && syncPersonId === person.id)
    );
    peopleTimelines.appendChild(card);
  });

  ensureSyncTarget();
}

function cardSchedule(card) {
  return PerchSchedule.normalizeSchedule({
    wakeTime: card.dataset.wakeTime,
    sleepTime: card.dataset.sleepTime,
    workStart: card.dataset.workStart,
    workEnd: card.dataset.workEnd
  });
}

function applyPresenceUi(card, presence) {
  card.classList.toggle('person-card--sleeping', presence === 'sleep');
  card.classList.toggle('person-card--off-hours', presence === 'away');
}

function updateTimelineCards() {
  const referenceProgress = getSyncReferenceProgress();

  peopleTimelines.querySelectorAll('.person-card').forEach((card) => {
    const zone = card.dataset.timezone || 'UTC';
    let parts;
    try {
      parts = getZonedParts(zone);
    } catch (_) {
      parts = getZonedParts('UTC');
    }

    const shift = timelineShiftFor(parts.progress, referenceProgress);
    const markerPos = PerchSchedule.wrapUnit(parts.progress - shift);

    card.querySelector('.person-card__time').textContent = parts.time;
    card.querySelector('.person-card__date').textContent = parts.date;
    card.querySelector('.timeline__marker').style.left = `${markerPos * 100}%`;
    applyTimelineShift(card, shift);
    card.classList.toggle(
      'person-card--sync-target',
      syncEnabled && card.dataset.id === syncPersonId
    );
    const nameBtn = card.querySelector('.person-card__name');
    if (nameBtn) {
      nameBtn.setAttribute(
        'aria-pressed',
        String(syncEnabled && card.dataset.id === syncPersonId)
      );
      nameBtn.title =
        syncEnabled && card.dataset.id === syncPersonId
          ? 'Click to turn sync off'
          : 'Click to sync timelines to this person';
    }
    applyPresenceUi(
      card,
      PerchSchedule.schedulePresence(cardSchedule(card), parts.progress)
    );
  });
}

function renderPeople(nextPeople) {
  people = Array.isArray(nextPeople) ? nextPeople : [];
  ensureTimelineCards();
  updateTimelineCards();
}

function startTicker() {
  if (tickTimer) clearInterval(tickTimer);
  updateTimelineCards();
  tickTimer = setInterval(updateTimelineCards, 1000);
}

settingsBtn.addEventListener('click', () => {
  setView(currentView === 'settings' ? 'home' : 'settings');
});

document.getElementById('openPeopleConfigBtn').addEventListener('click', () => {
  window.electronAPI.openPeopleConfig();
});

themeSwitch.addEventListener('click', () => {
  setTheme(theme === 'dark' ? 'light' : 'dark');
});

accentAutoBtn.addEventListener('click', () => {
  setAccentMode('auto');
});

accentColorInput.addEventListener('input', () => {
  setAccentMode('manual', accentColorInput.value);
});

scaleSelect.addEventListener('change', () => {
  setScale(scaleSelect.value);
});

hourFormat12Btn.addEventListener('click', () => setHourFormat('12'));
hourFormat24Btn.addEventListener('click', () => setHourFormat('24'));

document.getElementById('minimizeBtn').addEventListener('click', () => {
  window.electronAPI.minimize();
});

maximizeBtn.addEventListener('click', () => {
  window.electronAPI.maximizeToggle();
});

document.getElementById('closeBtn').addEventListener('click', () => {
  window.electronAPI.close();
});

window.electronAPI.onSystemAccentColorChange((color) => {
  if (accentMode === 'auto') {
    applyAccent(color);
  }
});

window.electronAPI.onPeopleUpdated((next) => {
  renderPeople(next);
});

setTheme(theme);
setAccentMode(accentMode, manualAccent);
setScale(scalePercent);
setHourFormat(hourFormat);
setView('home');
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);

window.electronAPI.getPeople().then((next) => {
  renderPeople(next);
  startTicker();
});
