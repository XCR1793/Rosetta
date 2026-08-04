const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

if (process.platform === 'win32') {
  app.setAppUserModelId('com.rosetta.app');
}

let mainWindow;

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

  if (process.platform === 'win32') {
    mainWindow.setIcon(icon);
  }

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
