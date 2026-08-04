const settingsBtn = document.getElementById('settingsBtn');
const titleLabel = document.getElementById('titleLabel');
const homeView = document.getElementById('homeView');
const settingsView = document.getElementById('settingsView');
const themeSwitch = document.getElementById('themeSwitch');
const themeHint = document.getElementById('themeHint');
const accentAutoBtn = document.getElementById('accentAutoBtn');
const accentColorInput = document.getElementById('accentColorInput');
const accentSwatchFill = document.getElementById('accentSwatchFill');
const accentHint = document.getElementById('accentHint');
const appRoot = document.querySelector('.app');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');

const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';
const THEME_KEY = 'perch.theme';
const ACCENT_MODE_KEY = 'perch.accentMode';
const ACCENT_COLOR_KEY = 'perch.accentColor';
const FALLBACK_ACCENT = '#0078d4';

let currentView = 'home';
let theme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
let accentMode = localStorage.getItem(ACCENT_MODE_KEY) === 'manual' ? 'manual' : 'auto';
let manualAccent = normalizeHex(localStorage.getItem(ACCENT_COLOR_KEY) || FALLBACK_ACCENT);
let activeAccent = FALLBACK_ACCENT;

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

settingsBtn.addEventListener('click', () => {
  setView(currentView === 'settings' ? 'home' : 'settings');
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

setTheme(theme);
setAccentMode(accentMode, manualAccent);
setView('home');
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);
