/**
 * @fileoverview Configuration Manager Service
 * 
 * @description
 * Handles loading and saving application configuration to disk.
 * Provides default configuration when no saved config exists.
 * 
 * @module main/services/ConfigManager
 * @category main
 * 
 * @requires electron
 * @requires fs
 * @requires path
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * @class ConfigManager
 * @description
 * Manages application configuration persistence.
 * Loads config from user data directory and saves changes.
 */
class ConfigManager {
  /**
   * @private
   * @type {string|null}
   * @description Cached path to configuration file
   */
  #configPath = null;

  /**
   * @private
   * @type {Object}
   * @description Default configuration object
   */
  #defaultConfig = {
    windowBounds: { width: 500, height: 300, x: undefined, y: undefined },
    use24Hour: false,
    compactMode: false,
    syncMode: true,
    converterOpen: false,
    converterPreferences: {},
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

  /**
   * Get the path to the configuration file
   * 
   * @returns {string} Absolute path to config.json
   * 
   * @description
   * Returns the path to the configuration file in the user data directory.
   * The path is cached after first access for performance.
   */
  getConfigPath() {
    if (!this.#configPath) {
      this.#configPath = path.join(app.getPath('userData'), 'config.json');
    }
    return this.#configPath;
  }

  /**
   * Load configuration from disk
   * 
   * @returns {Object} Configuration object
   * 
   * @description
   * Attempts to load configuration from disk. If the file doesn't exist
   * or is corrupted, returns the default configuration.
   * 
   * @example
   * const config = configManager.loadConfig();
   * console.log(config.timelines);
   */
  loadConfig() {
    try {
      const cfgPath = this.getConfigPath();
      if (fs.existsSync(cfgPath)) {
        const data = fs.readFileSync(cfgPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }

    // Return default config
    return { ...this.#defaultConfig };
  }

  /**
   * Save configuration to disk
   * 
   * @param {Object} config - Configuration object to save
   * @returns {boolean} True if save was successful
   * 
   * @description
   * Persists the configuration object to disk as JSON.
   * Creates the config file if it doesn't exist.
   * 
   * @example
   * config.use24Hour = true;
   * configManager.saveConfig(config);
   */
  saveConfig(config) {
    try {
      fs.writeFileSync(this.getConfigPath(), JSON.stringify(config, null, 2));
      return true;
    } catch (e) {
      console.error('Error saving config:', e);
      return false;
    }
  }

  /**
   * Get the default configuration
   * 
   * @returns {Object} Copy of the default configuration object
   */
  getDefaultConfig() {
    return { ...this.#defaultConfig };
  }
}

module.exports = ConfigManager;
