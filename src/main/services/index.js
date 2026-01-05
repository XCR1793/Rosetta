/**
 * @fileoverview Main Services Index
 * 
 * @description
 * Re-exports all main process services for convenient importing.
 * 
 * @module main/services
 * @category main
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

const ConfigManager = require('./ConfigManager');
const WindowManager = require('./WindowManager');

module.exports = {
  ConfigManager,
  WindowManager
};
