/**
 * @fileoverview Main Application Entry Point
 * 
 * @description
 * Entry point for the Electron main process. Initializes the application,
 * creates windows, and sets up IPC handlers.
 * 
 * @module main/main
 * @category main
 * 
 * @requires electron
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const { app, BrowserWindow } = require('electron');
const { ConfigManager, WindowManager } = require('./services');
const { AppController } = require('./controllers');

// Set AppUserModelId for Windows taskbar icon grouping
if (process.platform === 'win32') {
  app.setAppUserModelId('com.rosetta.app');
}

/**
 * @class Application
 * @description
 * Main application orchestrator that coordinates all services
 * and manages the application lifecycle.
 */
class Application {
  /**
   * @private
   * @type {ConfigManager}
   */
  #configManager = null;

  /**
   * @private
   * @type {WindowManager}
   */
  #windowManager = null;

  /**
   * @private
   * @type {AppController}
   */
  #appController = null;

  /**
   * Initialize the application
   * 
   * @description
   * Creates service instances and registers IPC handlers.
   * Should be called before creating windows.
   */
  initialize() {
    // Initialize services
    this.#configManager = new ConfigManager();
    this.#windowManager = new WindowManager(this.#configManager);

    // Initialize controllers
    this.#appController = new AppController(this.#configManager);
    this.#appController.registerHandlers();
  }

  /**
   * Create the main application window
   * 
   * @returns {BrowserWindow} The created window
   */
  createWindow() {
    return this.#windowManager.createMainWindow();
  }

  /**
   * Handle application activation (macOS)
   * 
   * @description
   * Creates a new window if none exist when the dock icon is clicked.
   */
  onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  /**
   * Handle all windows closed event
   * 
   * @description
   * Quits the application when all windows are closed.
   */
  onWindowAllClosed() {
    app.quit();
  }
}

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

const application = new Application();

/**
 * Application ready handler
 * Initializes the application and creates the main window
 */
app.whenReady().then(() => {
  application.initialize();
  application.createWindow();
});

/**
 * All windows closed handler
 */
app.on('window-all-closed', () => {
  application.onWindowAllClosed();
});

/**
 * Application activation handler (macOS)
 */
app.on('activate', () => {
  application.onActivate();
});
