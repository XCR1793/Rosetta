const settingsBtn = document.getElementById('settingsBtn');
const titleLabel = document.getElementById('titleLabel');
const homeView = document.getElementById('homeView');
const settingsView = document.getElementById('settingsView');

const maximizeBtn = document.getElementById('maximizeBtn');
const maximizeIcon = document.getElementById('maximizeIcon');

const GLYPH_MAXIMIZE = '\uE922';
const GLYPH_RESTORE = '\uE923';

let currentView = 'home';

function setView(view) {
  currentView = view;
  const inSettings = view === 'settings';

  homeView.hidden = inSettings;
  settingsView.hidden = !inSettings;
  settingsBtn.classList.toggle('active', inSettings);
  titleLabel.textContent = inSettings ? 'Settings' : '';
}

function setMaximizedUi(maximized) {
  maximizeIcon.textContent = maximized ? GLYPH_RESTORE : GLYPH_MAXIMIZE;
  maximizeBtn.title = maximized ? 'Restore' : 'Maximize';
  maximizeBtn.setAttribute('aria-label', maximized ? 'Restore' : 'Maximize');
}

settingsBtn.addEventListener('click', () => {
  setView(currentView === 'settings' ? 'home' : 'settings');
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

setView('home');
window.electronAPI.isMaximized().then(setMaximizedUi);
window.electronAPI.onMaximizedChange(setMaximizedUi);
