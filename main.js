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

if (process.platform === 'win32') {
  app.setAppUserModelId('com.perch.app');
}

let mainWindow = null;
let configWindow = null;
let peoplePath = null;

function getPeoplePath() {
  if (!peoplePath) {
    peoplePath = path.join(app.getPath('userData'), 'people.yaml');
  }
  return peoplePath;
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
