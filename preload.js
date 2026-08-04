const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximizeToggle: () => ipcRenderer.send('window-maximize-toggle'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  setBackgroundColor: (color) => ipcRenderer.send('window-background-color', color),
  getSystemAccentColor: () => ipcRenderer.invoke('get-system-accent-color'),
  onMaximizedChange: (callback) => {
    const listener = (_event, maximized) => callback(maximized);
    ipcRenderer.on('window-maximized', listener);
    return () => ipcRenderer.removeListener('window-maximized', listener);
  },
  onSystemAccentColorChange: (callback) => {
    const listener = (_event, color) => callback(color);
    ipcRenderer.on('system-accent-color', listener);
    return () => ipcRenderer.removeListener('system-accent-color', listener);
  }
});
