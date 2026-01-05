const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// Set AppUserModelId for Windows taskbar icon grouping
if (process.platform === 'win32') {
  app.setAppUserModelId('com.rosetta.app');
}

let mainWindow;
let configPath = null;

function getConfigPath() {
  if (!configPath) {
    configPath = path.join(app.getPath('userData'), 'config.json');
  }
  return configPath;
}

function loadConfig() {
  try {
    const cfgPath = getConfigPath();
    if (fs.existsSync(cfgPath)) {
      return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }

  // Default config
  return {
    windowBounds: { width: 500, height: 300, x: undefined, y: undefined },
    use24Hour: false,
    converterOpen: false,
    timelines: [
      {
        id: '1',
        name: 'You',
        timezone: 'Australia/Sydney',
        wakeTime: '07:00',
        sleepTime: '23:00',
        workStart: '09:00',
        workEnd: '17:00'
      },
      {
        id: '2',
        name: 'Colleague',
        timezone: 'America/Chicago',
        wakeTime: '07:00',
        sleepTime: '23:00',
        workStart: '09:00',
        workEnd: '17:00'
      }
    ]
  };
}

function saveConfig(config) {
  try {
    fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

function createWindow() {
  const config = loadConfig();
  const { width, height, x, y } = config.windowBounds;

  // Determine icon path - different for dev vs production
  const iconPath = app.isPackaged 
    ? path.join(process.resourcesPath, 'Logo.ico')
    : path.join(__dirname, 'Logo.ico');

  const icon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    frame: false,
    alwaysOnTop: true,
    transparent: false,
    resizable: true,
    minimizable: false,
    maximizable: false,
    skipTaskbar: false,
    backgroundColor: '#1a1a2e',
    icon: icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Explicitly set the icon for Windows taskbar
  if (process.platform === 'win32') {
    mainWindow.setIcon(icon);
  }

  mainWindow.loadFile('index.html');

  // Open DevTools for debugging (can be removed in production)
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  // Save window position on move/resize
  mainWindow.on('moved', () => {
    const bounds = mainWindow.getBounds();
    const config = loadConfig();
    config.windowBounds = bounds;
    saveConfig(config);
  });

  mainWindow.on('resized', () => {
    const bounds = mainWindow.getBounds();
    const config = loadConfig();
    config.windowBounds = bounds;
    saveConfig(config);
  });
}

// IPC handlers
ipcMain.handle('get-config', () => {
  return loadConfig();
});

ipcMain.handle('save-config', (event, config) => {
  saveConfig(config);
  return true;
});

ipcMain.on('close-app', () => {
  app.quit();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
