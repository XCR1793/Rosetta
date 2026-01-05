/**
 * @fileoverview Window Manager Service
 * 
 * @description
 * Manages BrowserWindow instances for the application.
 * Handles window creation, positioning, and event management.
 * 
 * @module main/services/WindowManager
 * @category main
 * 
 * @requires electron
 * @requires path
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * @class WindowManager
 * @description
 * Manages the application's BrowserWindow instances.
 * Handles window lifecycle, positioning, and configuration persistence.
 */
class WindowManager {
  /**
   * @private
   * @type {BrowserWindow|null}
   * @description Reference to the main application window
   */
  #mainWindow = null;

  /**
   * @private
   * @type {ConfigManager}
   * @description Reference to the configuration manager
   */
  #configManager = null;

  /**
   * Create a WindowManager instance
   * 
   * @param {ConfigManager} configManager - Configuration manager instance
   */
  constructor(configManager) {
    this.#configManager = configManager;
  }

  /**
   * Create and configure the main application window
   * 
   * @returns {BrowserWindow} The created window instance
   * 
   * @description
   * Creates the main BrowserWindow with saved bounds and configuration.
   * Sets up event listeners for window move/resize to persist position.
   * 
   * @example
   * const window = windowManager.createMainWindow();
   */
  createMainWindow() {
    const config = this.#configManager.loadConfig();
    const { width, height, x, y } = config.windowBounds;

    this.#mainWindow = new BrowserWindow({
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
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload', 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    // Load the main HTML file
    this.#mainWindow.loadFile(path.join(__dirname, '..', '..', '..', 'index.html'));

    // Setup window event handlers
    this.#setupWindowEvents();

    return this.#mainWindow;
  }

  /**
   * Setup window event handlers for position/size persistence
   * 
   * @private
   * 
   * @description
   * Attaches event handlers to save window bounds when moved or resized.
   */
  #setupWindowEvents() {
    if (!this.#mainWindow) return;

    // Save window position on move
    this.#mainWindow.on('moved', () => {
      this.#saveWindowBounds();
    });

    // Save window size on resize
    this.#mainWindow.on('resized', () => {
      this.#saveWindowBounds();
    });
  }

  /**
   * Save current window bounds to configuration
   * 
   * @private
   * 
   * @description
   * Saves the current window position and size to the configuration file.
   */
  #saveWindowBounds() {
    if (!this.#mainWindow) return;

    const bounds = this.#mainWindow.getBounds();
    const config = this.#configManager.loadConfig();
    config.windowBounds = bounds;
    this.#configManager.saveConfig(config);
  }

  /**
   * Get the main window instance
   * 
   * @returns {BrowserWindow|null} The main window or null if not created
   */
  getMainWindow() {
    return this.#mainWindow;
  }

  /**
   * Close all windows
   * 
   * @description
   * Closes all managed windows gracefully.
   */
  closeAllWindows() {
    if (this.#mainWindow) {
      this.#mainWindow.close();
      this.#mainWindow = null;
    }
  }
}

module.exports = WindowManager;
