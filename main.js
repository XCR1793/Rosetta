const { app, BrowserWindow, ipcMain, nativeImage, systemPreferences } = require('electron');
const path = require('path');

if (process.platform === 'win32') {
  app.setAppUserModelId('com.perch.app');
}

let mainWindow;

function normalizeAccentColor(raw) {
  if (typeof raw !== 'string') return '#0078d4';

  const hex = raw.replace('#', '').trim();
  if (hex.length >= 6) {
    return `#${hex.slice(0, 6).toLowerCase()}`;
  }

  return '#0078d4';
}

function getSystemAccentColor() {
  try {
    return normalizeAccentColor(systemPreferences.getAccentColor());
  } catch (e) {
    console.error('Error reading system accent color:', e);
    return '#0078d4';
  }
}

function broadcastAccentColor(color) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('system-accent-color', normalizeAccentColor(color));
  }
}

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'Logo.ico')
    : path.join(__dirname, 'Logo.ico');
  const icon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    alwaysOnTop: false,
    transparent: false,
    resizable: true,
    minimizable: true,
    maximizable: true,
    skipTaskbar: false,
    backgroundColor: '#fefefe',
    icon: icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.platform === 'win32') {
    mainWindow.setIcon(icon);
  }

  mainWindow.loadFile('index.html');

  const sendMaximizedState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-maximized', mainWindow.isMaximized());
    }
  };

  mainWindow.on('maximize', sendMaximizedState);
  mainWindow.on('unmaximize', sendMaximizedState);
}

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize-toggle', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.on('window-background-color', (_event, color) => {
  if (mainWindow && typeof color === 'string') {
    mainWindow.setBackgroundColor(color);
  }
});

ipcMain.handle('get-system-accent-color', () => {
  return getSystemAccentColor();
});

app.whenReady().then(() => {
  createWindow();

  systemPreferences.on('accent-color-changed', (_event, newColor) => {
    broadcastAccentColor(newColor || getSystemAccentColor());
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
