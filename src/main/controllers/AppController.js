/**
 * @fileoverview IPC Controller for Application
 * 
 * @description
 * Handles IPC (Inter-Process Communication) between main and renderer processes.
 * Registers handlers for configuration and application control requests.
 * 
 * @module main/controllers/AppController
 * @category main
 * 
 * @requires electron
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const { ipcMain, app } = require('electron');

/**
 * @class AppController
 * @description
 * Controller for handling IPC requests from the renderer process.
 * Manages configuration get/save and application lifecycle commands.
 */
class AppController {
  /**
   * @private
   * @type {ConfigManager}
   * @description Reference to the configuration manager
   */
  #configManager = null;

  /**
   * Create an AppController instance
   * 
   * @param {ConfigManager} configManager - Configuration manager instance
   */
  constructor(configManager) {
    this.#configManager = configManager;
  }

  /**
   * Register all IPC handlers
   * 
   * @description
   * Sets up IPC handlers for:
   * - get-config: Returns current configuration
   * - save-config: Saves configuration to disk
   * - close-app: Quits the application
   * 
   * @example
   * const controller = new AppController(configManager);
   * controller.registerHandlers();
   */
  registerHandlers() {
    /**
     * @description Handle get-config request
     * Returns the current application configuration
     */
    ipcMain.handle('get-config', () => {
      return this.#configManager.loadConfig();
    });

    /**
     * @description Handle save-config request
     * Saves the provided configuration to disk
     */
    ipcMain.handle('save-config', (event, config) => {
      return this.#configManager.saveConfig(config);
    });

    /**
     * @description Handle close-app request
     * Quits the application
     */
    ipcMain.on('close-app', () => {
      app.quit();
    });
  }

  /**
   * Unregister all IPC handlers
   * 
   * @description
   * Removes all registered IPC handlers. Should be called
   * before app shutdown or when reinitializing handlers.
   */
  unregisterHandlers() {
    ipcMain.removeHandler('get-config');
    ipcMain.removeHandler('save-config');
    ipcMain.removeAllListeners('close-app');
  }
}

module.exports = AppController;
