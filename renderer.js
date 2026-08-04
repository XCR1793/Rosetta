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
const appRoot = document.querySelector('.app');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');

const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';
const THEME_KEY = 'perch.theme';
const ACCENT_MODE_KEY = 'perch.accentMode';
const ACCENT_COLOR_KEY = 'perch.accentColor';
const SCALE_KEY = 'perch.scale';
const FALLBACK_ACCENT = '#0078d4';
const SCALE_OPTIONS = [75, 90, 100, 110, 125, 150];

let currentView = 'home';
let theme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
let accentMode = localStorage.getItem(ACCENT_MODE_KEY) === 'manual' ? 'manual' : 'auto';
let manualAccent = normalizeHex(localStorage.getItem(ACCENT_COLOR_KEY) || FALLBACK_ACCENT);
let activeAccent = FALLBACK_ACCENT;
let scalePercent = readStoredScale();
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
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    date: `${parts.day} ${parts.month}`,
    // Looping marker: 0..1 wraps naturally each midnight
    progress: ((dayFraction % 1) + 1) % 1
  };
}

function formatHourLabel(hour) {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  if (hour < 12) return `${hour}a`;
  return `${hour - 12}p`;
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
    if (!card) {
      card = document.createElement('article');
      card.className = 'person-card';
      card.innerHTML = `
        <div class="person-card__name"></div>
        <div class="timeline-block">
          <div class="timeline neo-surface neo-surface--dip neo-surface--pill">
            <div class="timeline__track"></div>
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

      const hoursEl = card.querySelector('.timeline__hours');
      const labelsEl = card.querySelector('.timeline__labels');

      // Absolute positions share one scale with the marker: midnight=0%, next midnight=100%.
      for (let hour = 0; hour < 24; hour += 1) {
        const tick = document.createElement('span');
        tick.className = `timeline__hour${hour % 3 === 0 ? ' timeline__hour--major' : ''}`;
        tick.style.left = `${(hour / 24) * 100}%`;
        tick.setAttribute('aria-hidden', 'true');
        hoursEl.appendChild(tick);
      }

      // Labels every 3 hours keeps a tiny widget readable.
      for (let hour = 0; hour < 24; hour += 3) {
        const label = document.createElement('span');
        label.className = 'timeline__label' + (hour === 0 ? ' timeline__label--start' : '');
        label.style.left = `${(hour / 24) * 100}%`;
        label.textContent = formatHourLabel(hour);
        labelsEl.appendChild(label);
      }
    }

    card.dataset.id = person.id;
    card.dataset.timezone = person.resolvedTimezone || person.timezone || 'UTC';
    card.querySelector('.person-card__name').textContent = person.name;
    peopleTimelines.appendChild(card);
  });
}

function updateTimelineCards() {
  peopleTimelines.querySelectorAll('.person-card').forEach((card) => {
    const zone = card.dataset.timezone || 'UTC';
    let parts;
    try {
      parts = getZonedParts(zone);
    } catch (_) {
      parts = getZonedParts('UTC');
    }

    card.querySelector('.person-card__time').textContent = parts.time;
    card.querySelector('.person-card__date').textContent = parts.date;
    card.querySelector('.timeline__marker').style.left = `${parts.progress * 100}%`;
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
setView('home');
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);

window.electronAPI.getPeople().then((next) => {
  renderPeople(next);
  startTicker();
});
