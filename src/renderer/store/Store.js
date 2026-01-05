/**
 * @fileoverview Application State Store
 * 
 * @description
 * Manages the global application state for the renderer process.
 * Provides reactive state management with observers for state changes.
 * 
 * @module renderer/store/Store
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * @class Store
 * @description
 * Simple state management store for the application.
 * Manages state like time format, compact mode, sync mode, etc.
 */
class Store {
  /**
   * @private
   * @type {Object}
   * @description Current state object
   */
  #state = {
    config: null,
    use24Hour: false,
    compactMode: false,
    syncMode: true,
    converterType: 'temperature',
    converterFromUnit: '',
    converterToUnit: '',
    currencyRates: null,
    currencyRatesLastUpdated: null,
    timelineOffset: 0
  };

  /**
   * @private
   * @type {Map<string, Set<Function>>}
   * @description Observers for state changes
   */
  #observers = new Map();

  /**
   * Get current state value
   * 
   * @param {string} key - State key to retrieve
   * @returns {*} State value
   * 
   * @example
   * const use24Hour = store.get('use24Hour');
   */
  get(key) {
    return this.#state[key];
  }

  /**
   * Set state value
   * 
   * @param {string} key - State key to set
   * @param {*} value - Value to set
   * 
   * @description
   * Sets the state value and notifies all observers of the change.
   * 
   * @example
   * store.set('use24Hour', true);
   */
  set(key, value) {
    const oldValue = this.#state[key];
    this.#state[key] = value;
    this.#notifyObservers(key, value, oldValue);
  }

  /**
   * Get entire state object
   * 
   * @returns {Object} Copy of state object
   */
  getState() {
    return { ...this.#state };
  }

  /**
   * Update multiple state values at once
   * 
   * @param {Object} updates - Object with key-value pairs to update
   * 
   * @example
   * store.update({ use24Hour: true, compactMode: false });
   */
  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Subscribe to state changes
   * 
   * @param {string} key - State key to observe
   * @param {Function} callback - Function called on state change
   * @returns {Function} Unsubscribe function
   * 
   * @example
   * const unsubscribe = store.subscribe('use24Hour', (newValue, oldValue) => {
   *   console.log('Time format changed:', newValue);
   * });
   */
  subscribe(key, callback) {
    if (!this.#observers.has(key)) {
      this.#observers.set(key, new Set());
    }
    this.#observers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      this.#observers.get(key)?.delete(callback);
    };
  }

  /**
   * Notify observers of state change
   * 
   * @private
   * @param {string} key - State key that changed
   * @param {*} newValue - New state value
   * @param {*} oldValue - Previous state value
   */
  #notifyObservers(key, newValue, oldValue) {
    if (newValue === oldValue) return;
    
    const observers = this.#observers.get(key);
    if (observers) {
      observers.forEach(callback => {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          console.error(`Error in store observer for ${key}:`, error);
        }
      });
    }
  }

  /**
   * Initialize store from config
   * 
   * @param {Object} config - Configuration object from main process
   * 
   * @example
   * const config = await window.electronAPI.getConfig();
   * store.initFromConfig(config);
   */
  initFromConfig(config) {
    this.#state.config = config;
    this.#state.use24Hour = config.use24Hour || false;
    this.#state.compactMode = config.compactMode || false;
    this.#state.syncMode = config.syncMode !== false;
  }
}

// Export singleton instance
export const store = new Store();
export default store;
