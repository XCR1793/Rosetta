const {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  systemPreferences
} = require('electron');
const path = require('path');
const {
  listCountries,
  listStates,
  getCurrencyForCountry,
  getTimezonesForLocation,
  listAllTimezones,
  listGmtOffsets
} = require('./lib/locations');
const {
  loadPeopleFile,
  savePeopleFile,
  enrichPeople,
  createId,
  normalizePerson
} = require('./lib/people');
const { getSystemAccentColor } = require('./lib/accent');
const {
  resolveWindowState,
  trackWindowState
} = require('./lib/window-state');
const { getExchangeRate } = require('./lib/exchange');
const { loadPrefs, savePrefs } = require('./lib/prefs');

if (process.platform === 'win32') {
  app.setAppUserModelId('com.perch.app');
}

let mainWindow = null;
let configWindow = null;
let peoplePath = null;
let prefsPathRoot = null;

const PANEL_WIDTH = 340;
const PANEL_HEIGHT = 160;

/** @type {{ expanded: boolean, direction: 'left'|'right'|'down' }} */
let panelState = {
  expanded: false,
  direction: 'right'
};

function getPeoplePath() {
  if (!peoplePath) {
    peoplePath = path.join(app.getPath('userData'), 'people.yaml');
  }
  return peoplePath;
}

function getPrefsRoot() {
  if (!prefsPathRoot) {
    prefsPathRoot = app.getPath('userData');
  }
  return prefsPathRoot;
}

function getDefaultPeoplePath() {
  return path.join(__dirname, 'defaults', 'people.yaml');
}

function getIcon() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'Logo.ico')
    : path.join(__dirname, 'Logo.ico');
  return nativeImage.createFromPath(iconPath);
}

function broadcastAccentColor() {
  const normalized = getSystemAccentColor();
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send('system-accent-color', normalized);
    }
  }
}

function broadcastPeople(people) {
  const payload = enrichPeople(people);
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send('people-updated', payload);
    }
  }
}

function readPeople() {
  const data = loadPeopleFile(getPeoplePath(), getDefaultPeoplePath());
  return enrichPeople(data.people);
}

function writePeople(people) {
  const saved = savePeopleFile(getPeoplePath(), { people });
  const enriched = enrichPeople(saved.people);
  broadcastPeople(enriched);
  return enriched;
}

function coreBoundsFromExpanded(bounds, direction) {
  if (direction === 'left') {
    return {
      x: bounds.x + PANEL_WIDTH,
      y: bounds.y,
      width: Math.max(280, bounds.width - PANEL_WIDTH),
      height: bounds.height
    };
  }
  if (direction === 'down') {
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: Math.max(200, bounds.height - PANEL_HEIGHT)
    };
  }
  // right
  return {
    x: bounds.x,
    y: bounds.y,
    width: Math.max(280, bounds.width - PANEL_WIDTH),
    height: bounds.height
  };
}

function expandedBoundsFromCore(core, direction) {
  if (direction === 'left') {
    return {
      x: core.x - PANEL_WIDTH,
      y: core.y,
      width: core.width + PANEL_WIDTH,
      height: core.height
    };
  }
  if (direction === 'down') {
    return {
      x: core.x,
      y: core.y,
      width: core.width,
      height: core.height + PANEL_HEIGHT
    };
  }
  return {
    x: core.x,
    y: core.y,
    width: core.width + PANEL_WIDTH,
    height: core.height
  };
}

function setPanelExpanded(win, expanded, direction = panelState.direction) {
  if (!win || win.isDestroyed()) {
    return { ...panelState };
  }

  const nextDirection = ['left', 'right', 'down'].includes(direction)
    ? direction
    : 'right';
  const nextExpanded = Boolean(expanded);

  if (win.isMaximized()) {
    win.unmaximize();
  }

  const current = win.getBounds();

  // Always return to core bounds before applying a new panel geometry.
  if (panelState.expanded) {
    win.setBounds(coreBoundsFromExpanded(current, panelState.direction), true);
  }

  if (nextExpanded) {
    const core = win.getBounds();
    win.setBounds(expandedBoundsFromCore(core, nextDirection), true);
  }

  panelState = {
    expanded: nextExpanded,
    direction: nextDirection
  };

  return { ...panelState };
}

function createMainWindow() {
  const icon = getIcon();
  const userDataPath = app.getPath('userData');
  const state = resolveWindowState(userDataPath);

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    frame: false,
    alwaysOnTop: false,
    transparent: false,
    resizable: true,
    minimizable: true,
    maximizable: true,
    skipTaskbar: false,
    backgroundColor: '#fefefe',
    show: false,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.getPerchPersistBounds = (normal) => {
    if (!panelState.expanded) return normal;
    return coreBoundsFromExpanded(normal, panelState.direction);
  };

  if (process.platform === 'win32') {
    mainWindow.setIcon(icon);
  }

  trackWindowState(mainWindow, userDataPath);
  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    if (state.isMaximized) {
      mainWindow.maximize();
    }
    mainWindow.show();
  });

  const sendMaximizedState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-maximized', mainWindow.isMaximized());
    }
  };

  mainWindow.on('maximize', sendMaximizedState);
  mainWindow.on('unmaximize', sendMaximizedState);
  mainWindow.on('closed', () => {
    mainWindow = null;
    panelState.expanded = false;
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.close();
    }
  });
}

function openConfigWindow() {
  if (configWindow && !configWindow.isDestroyed()) {
    configWindow.focus();
    return;
  }

  const icon = getIcon();
  const parentBounds = mainWindow ? mainWindow.getBounds() : null;

  configWindow = new BrowserWindow({
    width: 920,
    height: 720,
    minWidth: 760,
    minHeight: 480,
    x: parentBounds ? parentBounds.x + 40 : undefined,
    y: parentBounds ? parentBounds.y + 40 : undefined,
    frame: false,
    parent: mainWindow || undefined,
    modal: false,
    show: false,
    backgroundColor: '#fefefe',
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.platform === 'win32') {
    configWindow.setIcon(icon);
  }

  configWindow.loadFile('config.html');
  configWindow.once('ready-to-show', () => configWindow.show());
  configWindow.on('closed', () => {
    configWindow = null;
  });
}

ipcMain.on('window-minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on('window-maximize-toggle', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});

ipcMain.on('window-close', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle('window-is-maximized', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win ? win.isMaximized() : false;
});

ipcMain.on('window-background-color', (event, color) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && typeof color === 'string') {
    win.setBackgroundColor(color);
  }
});

ipcMain.handle('get-system-accent-color', () => getSystemAccentColor());

ipcMain.handle('get-people', () => readPeople());

ipcMain.handle('save-people', (_event, people) => {
  const list = Array.isArray(people) ? people.map(normalizePerson) : [];
  return writePeople(list);
});

ipcMain.handle('create-person-id', () => createId());

ipcMain.handle('get-location-options', () => ({
  countries: listCountries(),
  allTimezones: listAllTimezones(),
  gmtOffsets: listGmtOffsets()
}));

ipcMain.handle('get-states', (_event, country) => listStates(country));

ipcMain.handle('get-timezones-for-location', (_event, country, state) =>
  getTimezonesForLocation(country, state)
);

ipcMain.handle('get-currency-for-country', (_event, country) =>
  getCurrencyForCountry(country)
);

ipcMain.handle('get-exchange-rate', async (_event, from, to, force = false) => {
  try {
    return await getExchangeRate(from, to, { force: Boolean(force) });
  } catch (error) {
    return {
      error: error.message || 'Failed to fetch exchange rate',
      from: String(from || '').toUpperCase(),
      to: String(to || '').toUpperCase()
    };
  }
});

ipcMain.handle('panel-get-state', () => ({ ...panelState }));

ipcMain.handle('panel-set-expanded', (event, payload = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win !== mainWindow) {
    return { ...panelState };
  }
  return setPanelExpanded(win, payload.expanded, payload.direction || panelState.direction);
});

ipcMain.handle('prefs-get', () => loadPrefs(getPrefsRoot()));

ipcMain.handle('prefs-set', (_event, patch) => {
  if (!patch || typeof patch !== 'object') return loadPrefs(getPrefsRoot());
  return savePrefs(getPrefsRoot(), patch);
});

ipcMain.on('open-people-config', () => {
  openConfigWindow();
});

app.whenReady().then(() => {
  readPeople();
  createMainWindow();

  systemPreferences.on('accent-color-changed', () => {
    broadcastAccentColor();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
