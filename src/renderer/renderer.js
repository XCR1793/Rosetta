/**
 * @fileoverview Renderer Process Entry Point
 * 
 * @description
 * Main entry point for the renderer process. Initializes all UI components,
 * sets up event listeners, and manages the application state.
 * 
 * @module renderer/renderer
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { store } from './store/Store.js';
import { TimelineComponent, ConverterComponent, SettingsComponent } from './components/features/index.js';
import { currencyService } from './services/CurrencyService.js';

/**
 * @class App
 * @description
 * Main application class for the renderer process.
 * Coordinates all UI components and manages the application lifecycle.
 */
class App {
  /**
   * @private
   * @type {TimelineComponent}
   */
  #timelineComponent = null;

  /**
   * @private
   * @type {ConverterComponent}
   */
  #converterComponent = null;

  /**
   * @private
   * @type {SettingsComponent}
   */
  #settingsComponent = null;

  /**
   * @private
   * @type {number}
   * @description Clock interval ID
   */
  #clockInterval = null;

  /**
   * Initialize the application
   * 
   * @description
   * Loads configuration, initializes components, and starts the clock.
   */
  async initialize() {
    try {
      // Load configuration
      const config = await window.electronAPI.getConfig();
      store.initFromConfig(config);

      // Initialize components
      this.#initializeComponents();

      // Setup event listeners
      this.#setupEventListeners();

      // Render initial state
      this.#render();

      // Start clock updates
      this.#startClock();

      // Restore converter panel state
      if (config.converterOpen) {
        await this.#converterComponent.open();
      }

    } catch (error) {
      console.error('Init error:', error);
      alert('Error initializing app: ' + error.message);
    }
  }

  /**
   * Initialize UI components
   * 
   * @private
   */
  #initializeComponents() {
    // Timeline component
    const timelinesContainer = document.getElementById('timelinesContainer');
    this.#timelineComponent = new TimelineComponent(timelinesContainer);

    // Converter component
    const converterPanel = document.getElementById('converterPanel');
    this.#converterComponent = new ConverterComponent(converterPanel);

    // Settings component
    const settingsPanel = document.getElementById('settingsPanel');
    this.#settingsComponent = new SettingsComponent(settingsPanel, () => {
      this.#renderTimelines();
    });
  }

  /**
   * Setup event listeners
   * 
   * @private
   */
  #setupEventListeners() {
    // Close button
    document.getElementById('closeBtn')?.addEventListener('click', () => {
      window.electronAPI.closeApp();
    });

    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      this.#settingsComponent.open();
    });

    // Close settings button
    document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
      this.#settingsComponent.close();
    });

    // Converter button
    document.getElementById('converterBtn')?.addEventListener('click', async () => {
      await this.#converterComponent.open();
      const config = store.get('config');
      config.converterOpen = true;
      store.set('config', config);
      await window.electronAPI.saveConfig(config);
    });

    // Close converter button
    document.getElementById('closeConverterBtn')?.addEventListener('click', async () => {
      this.#converterComponent.close();
      const config = store.get('config');
      config.converterOpen = false;
      store.set('config', config);
      await window.electronAPI.saveConfig(config);
    });

    // Sync button
    document.getElementById('syncBtn')?.addEventListener('click', async () => {
      const syncMode = !store.get('syncMode');
      store.set('syncMode', syncMode);
      
      const config = store.get('config');
      config.syncMode = syncMode;
      store.set('config', config);
      await window.electronAPI.saveConfig(config);
      
      this.#updateSyncButton();
      this.#timelineComponent.syncTimelines();
    });

    // Time format toggle
    document.getElementById('timeFormatBtn')?.addEventListener('click', async () => {
      const use24Hour = !store.get('use24Hour');
      store.set('use24Hour', use24Hour);
      
      const config = store.get('config');
      config.use24Hour = use24Hour;
      store.set('config', config);
      await window.electronAPI.saveConfig(config);
      
      this.#updateTimeFormatButton();
      this.#renderTimelines();
    });

    // Compact mode toggle
    document.getElementById('compactBtn')?.addEventListener('click', async () => {
      const compactMode = !store.get('compactMode');
      store.set('compactMode', compactMode);
      
      const config = store.get('config');
      config.compactMode = compactMode;
      store.set('config', config);
      await window.electronAPI.saveConfig(config);
      
      this.#updateCompactMode();
    });
  }

  /**
   * Render initial state
   * 
   * @private
   */
  #render() {
    this.#updateTimeFormatButton();
    this.#updateCompactMode();
    this.#updateSyncButton();
    this.#renderTimelines();
    this.#settingsComponent.render();
  }

  /**
   * Render timelines
   * 
   * @private
   */
  #renderTimelines() {
    const config = store.get('config');
    this.#timelineComponent.render(config.timelines);
    this.#timelineComponent.syncTimelines();
  }

  /**
   * Start the clock update interval
   * 
   * @private
   */
  #startClock() {
    this.#timelineComponent.updateClocks();
    this.#clockInterval = setInterval(() => {
      this.#timelineComponent.updateClocks();
    }, 1000);
  }

  /**
   * Update time format button text
   * 
   * @private
   */
  #updateTimeFormatButton() {
    const btn = document.getElementById('timeFormatBtn');
    const use24Hour = store.get('use24Hour');
    if (btn) {
      btn.textContent = use24Hour ? '24h' : '12h';
    }
  }

  /**
   * Update compact mode
   * 
   * @private
   */
  #updateCompactMode() {
    const container = document.querySelector('.app-container');
    const btn = document.getElementById('compactBtn');
    const compactMode = store.get('compactMode');
    
    if (compactMode) {
      container?.classList.add('compact');
      btn?.classList.add('active');
    } else {
      container?.classList.remove('compact');
      btn?.classList.remove('active');
    }
  }

  /**
   * Update sync button appearance
   * 
   * @private
   */
  #updateSyncButton() {
    const btn = document.getElementById('syncBtn');
    const container = document.querySelector('.app-container');
    const syncMode = store.get('syncMode');
    
    if (syncMode) {
      btn?.classList.add('active');
      container?.classList.remove('unsynced');
    } else {
      btn?.classList.remove('active');
      container?.classList.add('unsynced');
    }
  }
}

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
