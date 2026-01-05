/**
 * @fileoverview Preload Script for Electron
 * 
 * @description
 * Preload script that exposes a secure API to the renderer process.
 * Uses contextBridge to safely expose IPC functions while maintaining
 * context isolation.
 * 
 * @module preload/preload
 * @category preload
 * 
 * @requires electron
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * @description
 * Exposes the electronAPI to the renderer process.
 * This API provides methods for:
 * - Getting and saving configuration
 * - Closing the application
 * 
 * All communication with the main process goes through these methods.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Get the current application configuration
   * 
   * @returns {Promise<Object>} Configuration object
   * 
   * @example
   * const config = await window.electronAPI.getConfig();
   */
  getConfig: () => ipcRenderer.invoke('get-config'),

  /**
   * Save configuration to disk
   * 
   * @param {Object} config - Configuration object to save
   * @returns {Promise<boolean>} True if save was successful
   * 
   * @example
   * await window.electronAPI.saveConfig(config);
   */
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),

  /**
   * Close the application
   * 
   * @description
   * Sends a close-app message to the main process to quit the application.
   * 
   * @example
   * window.electronAPI.closeApp();
   */
  closeApp: () => ipcRenderer.send('close-app'),

  /**
   * Get startup enabled state
   * 
   * @returns {Promise<boolean>} True if startup is enabled
   */
  getStartupEnabled: () => ipcRenderer.invoke('get-startup-enabled'),

  /**
   * Set startup enabled state
   * 
   * @param {boolean} enabled - Whether startup should be enabled
   * @returns {Promise<boolean>} True if successful
   */
  setStartupEnabled: (enabled) => ipcRenderer.invoke('set-startup-enabled', enabled),

  /**
   * Get always on top state
   * 
   * @returns {Promise<boolean>} True if always on top is enabled
   */
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),

  /**
   * Set always on top state
   * 
   * @param {boolean} enabled - Whether always on top should be enabled
   * @returns {Promise<boolean>} True if successful
   */
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('set-always-on-top', enabled)
});
