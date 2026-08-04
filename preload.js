const { contextBridge, ipcRenderer, webFrame } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximizeToggle: () => ipcRenderer.send('window-maximize-toggle'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  setBackgroundColor: (color) => ipcRenderer.send('window-background-color', color),
  setZoomFactor: (factor) => {
    const value = Number(factor);
    if (Number.isFinite(value) && value >= 0.5 && value <= 3) {
      webFrame.setZoomFactor(value);
    }
  },
  getZoomFactor: () => webFrame.getZoomFactor(),
  getSystemAccentColor: () => ipcRenderer.invoke('get-system-accent-color'),
  getPeople: () => ipcRenderer.invoke('get-people'),
  savePeople: (people) => ipcRenderer.invoke('save-people', people),
  createPersonId: () => ipcRenderer.invoke('create-person-id'),
  getLocationOptions: () => ipcRenderer.invoke('get-location-options'),
  getStates: (country) => ipcRenderer.invoke('get-states', country),
  getTimezonesForLocation: (country, state) =>
    ipcRenderer.invoke('get-timezones-for-location', country, state),
  getCurrencyForCountry: (country) =>
    ipcRenderer.invoke('get-currency-for-country', country),
  openPeopleConfig: () => ipcRenderer.send('open-people-config'),
  onMaximizedChange: (callback) => {
    const listener = (_event, maximized) => callback(maximized);
    ipcRenderer.on('window-maximized', listener);
    return () => ipcRenderer.removeListener('window-maximized', listener);
  },
  onSystemAccentColorChange: (callback) => {
    const listener = (_event, color) => callback(color);
    ipcRenderer.on('system-accent-color', listener);
    return () => ipcRenderer.removeListener('system-accent-color', listener);
  },
  onPeopleUpdated: (callback) => {
    const listener = (_event, people) => callback(people);
    ipcRenderer.on('people-updated', listener);
    return () => ipcRenderer.removeListener('people-updated', listener);
  }
});
