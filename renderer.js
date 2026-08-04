const settingsBtn = document.getElementById('settingsBtn');
const convertBtn = document.getElementById('convertBtn');
const titleLabel = document.getElementById('titleLabel');
const homeView = document.getElementById('homeView');
const settingsView = document.getElementById('settingsView');
const peopleTimelines = document.getElementById('peopleTimelines');
const contentShell = document.getElementById('contentShell');
const convertPanel = document.getElementById('convertPanel');
const convertFromWho = document.getElementById('convertFromWho');
const convertFromCode = document.getElementById('convertFromCode');
const convertToWho = document.getElementById('convertToWho');
const convertToCode = document.getElementById('convertToCode');
const convertFromAmount = document.getElementById('convertFromAmount');
const convertToAmount = document.getElementById('convertToAmount');
const convertRateLine = document.getElementById('convertRateLine');
const convertRateUpdated = document.getElementById('convertRateUpdated');
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
const panelDirHint = document.getElementById('panelDirHint');
const panelDirLeftBtn = document.getElementById('panelDirLeftBtn');
const panelDirRightBtn = document.getElementById('panelDirRightBtn');
const panelDirDownBtn = document.getElementById('panelDirDownBtn');
const appRoot = document.querySelector('.app');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');
const updateBtn = document.getElementById('updateBtn');
const minimizeBtn = document.getElementById('minimizeBtn');

const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';
const THEME_KEY = 'perch.theme';
const ACCENT_MODE_KEY = 'perch.accentMode';
const ACCENT_COLOR_KEY = 'perch.accentColor';
const SCALE_KEY = 'perch.scale';
const HOUR_FORMAT_KEY = 'perch.hourFormat';
const SYNC_ENABLED_KEY = 'perch.syncEnabled';
const SYNC_PERSON_KEY = 'perch.syncPersonId';
const PANEL_DIR_KEY = 'perch.panelDirection';
const CONVERT_FROM_KEY = 'perch.convertFromId';
const CONVERT_TO_KEY = 'perch.convertToId';
const CONVERT_OVERRIDES_KEY = 'perch.convertCurrencyOverrides';
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
let panelDirection = ['left', 'right', 'down'].includes(localStorage.getItem(PANEL_DIR_KEY))
  ? localStorage.getItem(PANEL_DIR_KEY)
  : 'right';
let panelExpanded = false;
let convertFromId = localStorage.getItem(CONVERT_FROM_KEY) || '';
let convertToId = localStorage.getItem(CONVERT_TO_KEY) || '';
let convertCurrencyOverrides = readConvertOverrides();
let convertAwaitingTo = false;
let convertRate = null;
let convertFetchedAt = null;
let convertBusy = false;
let convertEditSide = 'from';
let rateRefreshTimer = null;
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

function readConvertOverrides() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONVERT_OVERRIDES_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object') return {};
    const next = {};
    for (const [id, code] of Object.entries(parsed)) {
      const value = String(code || '').trim().toUpperCase();
      if (id && /^[A-Z]{3}$/.test(value)) next[id] = value;
    }
    return next;
  } catch (_) {
    return {};
  }
}

function persistConvertOverrides() {
  localStorage.setItem(CONVERT_OVERRIDES_KEY, JSON.stringify(convertCurrencyOverrides));
}

function setConvertCurrencyOverride(personId, code) {
  if (!personId) return;
  const value = String(code || '').trim().toUpperCase();
  if (!value) {
    delete convertCurrencyOverrides[personId];
  } else if (/^[A-Z]{3}$/.test(value)) {
    convertCurrencyOverrides[personId] = value;
  }
  persistConvertOverrides();
  updateConvertSelectionUi();
  refreshExchangeRate(true);
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
    // Keep stored preference; we just can't apply sync without people yet.
    return;
  }

  if (!people.some((person) => person.id === syncPersonId)) {
    syncPersonId = people[0].id;
  }
  persistSyncState();
}

function persistSyncState() {
  localStorage.setItem(SYNC_ENABLED_KEY, String(Boolean(syncEnabled)));
  localStorage.setItem(SYNC_PERSON_KEY, syncPersonId || '');
  window.electronAPI.setPrefs({
    syncEnabled: Boolean(syncEnabled),
    syncPersonId: syncPersonId || ''
  });
}

function setSyncEnabled(enabled) {
  syncEnabled = Boolean(enabled) && people.length > 0;
  persistSyncState();
  updateTimelineCards();
}

function toggleSyncForPerson(id) {
  if (!people.some((person) => person.id === id)) return;

  if (syncEnabled && syncPersonId === id) {
    setSyncEnabled(false);
    return;
  }

  syncPersonId = id;
  syncEnabled = true;
  persistSyncState();
  updateTimelineCards();
}

function applyStoredSyncPrefs(prefs = {}) {
  if (typeof prefs.syncEnabled === 'boolean') {
    syncEnabled = prefs.syncEnabled;
  } else if (localStorage.getItem(SYNC_ENABLED_KEY) != null) {
    syncEnabled = localStorage.getItem(SYNC_ENABLED_KEY) === 'true';
  }

  if (typeof prefs.syncPersonId === 'string' && prefs.syncPersonId) {
    syncPersonId = prefs.syncPersonId;
  } else if (localStorage.getItem(SYNC_PERSON_KEY)) {
    syncPersonId = localStorage.getItem(SYNC_PERSON_KEY);
  }
}

function toggleHourFormat() {
  setHourFormat(hourFormat === '12' ? '24' : '12');
}

function ensureConvertPair() {
  const defaults = PerchConvert.defaultPair(people);
  if (!people.some((p) => p.id === convertFromId)) {
    convertFromId = defaults.fromId;
  }
  if (!people.some((p) => p.id === convertToId) || convertToId === convertFromId) {
    convertToId = defaults.toId;
  }
  localStorage.setItem(CONVERT_FROM_KEY, convertFromId);
  localStorage.setItem(CONVERT_TO_KEY, convertToId);
}

function onPersonNameClick(id) {
  if (!people.some((person) => person.id === id)) return;

  if (!convertAwaitingTo || id === convertFromId) {
    convertFromId = id;
    convertAwaitingTo = true;
    localStorage.setItem(CONVERT_FROM_KEY, convertFromId);
  } else {
    convertToId = id;
    convertAwaitingTo = false;
    localStorage.setItem(CONVERT_TO_KEY, convertToId);
  }

  updateConvertSelectionUi();
  refreshExchangeRate(true);
}

function panelDirLabel(dir) {
  if (dir === 'left') return 'Expands left';
  if (dir === 'down') return 'Expands down';
  return 'Expands right';
}

function setPanelDirection(dir, { resizeIfOpen = true } = {}) {
  panelDirection = ['left', 'right', 'down'].includes(dir) ? dir : 'right';
  localStorage.setItem(PANEL_DIR_KEY, panelDirection);
  contentShell.dataset.panelDir = panelDirection;
  panelDirLeftBtn.classList.toggle('active', panelDirection === 'left');
  panelDirRightBtn.classList.toggle('active', panelDirection === 'right');
  panelDirDownBtn.classList.toggle('active', panelDirection === 'down');
  panelDirHint.textContent = panelDirLabel(panelDirection);

  if (resizeIfOpen && panelExpanded) {
    window.electronAPI.setPanelExpanded(true, panelDirection);
  }
}

async function setPanelExpanded(expanded) {
  panelExpanded = Boolean(expanded);
  convertBtn.setAttribute('aria-pressed', String(panelExpanded));
  convertPanel.hidden = !panelExpanded;

  const state = await window.electronAPI.setPanelExpanded(panelExpanded, panelDirection);
  panelExpanded = Boolean(state?.expanded);
  convertBtn.setAttribute('aria-pressed', String(panelExpanded));
  convertPanel.hidden = !panelExpanded;

  if (panelExpanded) {
    ensureConvertPair();
    updateConvertSelectionUi();
    refreshExchangeRate(true);
    if (rateRefreshTimer) clearInterval(rateRefreshTimer);
    rateRefreshTimer = setInterval(() => refreshExchangeRate(true), 60 * 1000);
  } else {
    updateConvertSelectionUi();
    if (rateRefreshTimer) {
      clearInterval(rateRefreshTimer);
      rateRefreshTimer = null;
    }
  }
}

function updateConvertSelectionUi() {
  const fromPerson = PerchConvert.findPerson(people, convertFromId);
  const toPerson = PerchConvert.findPerson(people, convertToId);

  convertFromWho.textContent = fromPerson?.name || '—';
  convertToWho.textContent = toPerson?.name || '—';
  PerchConvert.fillCurrencySelect(convertFromCode, fromPerson, convertCurrencyOverrides);
  PerchConvert.fillCurrencySelect(convertToCode, toPerson, convertCurrencyOverrides);

  peopleTimelines.querySelectorAll('.person-card').forEach((card) => {
    const showConvert = panelExpanded;
    card.classList.toggle(
      'person-card--convert-from',
      showConvert && card.dataset.id === convertFromId
    );
    card.classList.toggle(
      'person-card--convert-to',
      showConvert && card.dataset.id === convertToId
    );
    const nameBtn = card.querySelector('.person-card__name');
    if (!nameBtn) return;
    if (!showConvert) {
      nameBtn.title = 'Click to set From / To for convert';
      return;
    }
    if (card.dataset.id === convertFromId) {
      nameBtn.title = 'From currency · click another name for To';
    } else if (card.dataset.id === convertToId) {
      nameBtn.title = 'To currency · click a name to set a new From';
    } else {
      nameBtn.title = convertAwaitingTo
        ? 'Click to set To currency'
        : 'Click to set From currency';
    }
  });
}

function applyConvertedAmount(fromSide) {
  if (!Number.isFinite(convertRate) || convertRate <= 0) return;

  if (fromSide === 'from') {
    const amount = PerchConvert.parseAmount(convertFromAmount.value);
    if (amount == null) {
      convertToAmount.value = '';
      return;
    }
    convertToAmount.value = PerchConvert.formatAmount(amount * convertRate);
    return;
  }

  const amount = PerchConvert.parseAmount(convertToAmount.value);
  if (amount == null) {
    convertFromAmount.value = '';
    return;
  }
  convertFromAmount.value = PerchConvert.formatAmount(amount / convertRate);
}

async function refreshExchangeRate(force = false) {
  if (!panelExpanded || convertBusy) return;

  const fromPerson = PerchConvert.findPerson(people, convertFromId);
  const toPerson = PerchConvert.findPerson(people, convertToId);
  const from = PerchConvert.effectiveCurrency(fromPerson, convertCurrencyOverrides);
  const to = PerchConvert.effectiveCurrency(toPerson, convertCurrencyOverrides);

  if (!from || !to) {
    convertRate = null;
    convertRateLine.textContent = 'Add currencies to both people';
    convertRateUpdated.textContent = '—';
    return;
  }

  convertBusy = true;
  convertRateLine.textContent = `1 ${from} → … ${to}`;
  try {
    const result = await window.electronAPI.getExchangeRate(from, to, force);
    if (result?.error && !Number.isFinite(result.rate)) {
      convertRateLine.textContent = result.error;
      convertRateUpdated.textContent = 'Could not refresh';
      return;
    }

    convertRate = Number(result.rate);
    convertFetchedAt = result.fetchedAt || Date.now();
    convertRateLine.textContent = `1 ${from} = ${PerchConvert.formatRate(convertRate)} ${to}`;
    convertRateUpdated.textContent =
      PerchConvert.formatUpdatedAt(convertFetchedAt) +
      (result.stale ? ' · stale' : '');

    if (convertEditSide === 'to') applyConvertedAmount('to');
    else applyConvertedAmount('from');
  } finally {
    convertBusy = false;
  }
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
    if (
      card &&
      (!card.querySelector('button.person-card__name') ||
        !card.querySelector('button.person-card__time'))
    ) {
      card = null;
    }
    if (!card) {
      card = document.createElement('article');
      card.className = 'person-card';
      card.innerHTML = `
        <button class="person-card__name" type="button"></button>
        <div class="timeline-block" role="button" tabindex="0">
          <div class="timeline neo-surface neo-surface--dip neo-surface--pill">
            <div class="timeline__track"><div class="timeline__track-strip"></div></div>
            <div class="timeline__schedule"></div>
            <div class="timeline__hours"></div>
            <div class="timeline__marker"></div>
          </div>
          <div class="timeline__labels"></div>
        </div>
        <div class="person-card__meta">
          <button class="person-card__time" type="button"></button>
          <div class="person-card__date"></div>
        </div>
      `;

      fillTimelineScaffold(
        card.querySelector('.timeline__hours'),
        card.querySelector('.timeline__labels')
      );

      card.querySelector('.person-card__name').addEventListener('click', () => {
        onPersonNameClick(card.dataset.id);
      });

      const timelineBlock = card.querySelector('.timeline-block');
      const syncFromTimeline = () => toggleSyncForPerson(card.dataset.id);
      timelineBlock.addEventListener('click', syncFromTimeline);
      timelineBlock.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          syncFromTimeline();
        }
      });

      card.querySelector('.person-card__time').addEventListener('click', (event) => {
        event.stopPropagation();
        toggleHourFormat();
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
    card.querySelector('.timeline-block').title =
      'Click timeline to sync everyone’s now to this person';
    card.querySelector('.person-card__time').title = 'Click to toggle 12h / 24h';
    peopleTimelines.appendChild(card);
  });

  ensureSyncTarget();
  ensureConvertPair();
  updateConvertSelectionUi();
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
    card.classList.toggle(
      'person-card--convert-from',
      panelExpanded && card.dataset.id === convertFromId
    );
    card.classList.toggle(
      'person-card--convert-to',
      panelExpanded && card.dataset.id === convertToId
    );
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

convertBtn.addEventListener('click', () => {
  setPanelExpanded(!panelExpanded);
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

panelDirLeftBtn.addEventListener('click', () => setPanelDirection('left'));
panelDirRightBtn.addEventListener('click', () => setPanelDirection('right'));
panelDirDownBtn.addEventListener('click', () => setPanelDirection('down'));

convertFromAmount.addEventListener('input', () => {
  convertEditSide = 'from';
  applyConvertedAmount('from');
});

convertToAmount.addEventListener('input', () => {
  convertEditSide = 'to';
  applyConvertedAmount('to');
});

convertFromCode.addEventListener('change', () => {
  setConvertCurrencyOverride(convertFromId, convertFromCode.value);
});

convertToCode.addEventListener('change', () => {
  setConvertCurrencyOverride(convertToId, convertToCode.value);
});

document.getElementById('minimizeBtn').addEventListener('click', () => {
  window.electronAPI.minimize();
});

updateBtn.addEventListener('click', async () => {
  updateBtn.classList.add('is-busy');
  updateBtn.disabled = true;
  try {
    const state = await window.electronAPI.startUpdate();
    applyUpdaterUi(state);
  } finally {
    updateBtn.disabled = false;
    updateBtn.classList.remove('is-busy');
  }
});

function applyUpdaterUi(state = {}) {
  const status = state.status || 'idle';
  const show =
    status === 'available' ||
    status === 'downloading' ||
    status === 'ready' ||
    status === 'error';

  updateBtn.hidden = !show;
  updateBtn.classList.toggle('is-busy', status === 'downloading' || status === 'checking');

  if (status === 'downloading') {
    const pct = Math.max(0, Math.min(100, Math.round(state.downloadProgress?.percent || 0)));
    updateBtn.textContent = `Downloading ${pct}%`;
    updateBtn.title = `Downloading Perch ${state.latestVersion || ''}`.trim();
  } else if (status === 'ready') {
    updateBtn.textContent = 'Restart to update';
    updateBtn.title = `Perch ${state.latestVersion} is ready — click to install and restart`;
  } else if (status === 'error') {
    updateBtn.textContent = 'Update failed';
    updateBtn.title = state.errorMessage || 'Update failed — click to retry';
  } else if (status === 'available') {
    updateBtn.textContent = 'Update available';
    updateBtn.title = state.packaged
      ? `Perch ${state.latestVersion} is available — click to download and install`
      : `Perch ${state.latestVersion} is available — packaged builds update in place; click opens releases while developing`;
  }
}

window.electronAPI.onUpdaterState((state) => {
  applyUpdaterUi(state);
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
  if (panelExpanded) refreshExchangeRate(true);
});

setTheme(theme);
setAccentMode(accentMode, manualAccent);
setScale(scalePercent);
setHourFormat(hourFormat);
setPanelDirection(panelDirection, { resizeIfOpen: false });
setView('home');
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);

(async function init() {
  try {
    const prefs = await window.electronAPI.getPrefs();
    applyStoredSyncPrefs(prefs || {});
  } catch (_) {
    applyStoredSyncPrefs({});
  }

  try {
    const updateState = await window.electronAPI.getUpdaterState();
    applyUpdaterUi(updateState);
  } catch (_) {
    /* ignore */
  }

  const next = await window.electronAPI.getPeople();
  renderPeople(next);
  startTicker();
})();
