/**
 * @fileoverview Currency API Service
 * 
 * @description
 * Handles fetching currency exchange rates from external APIs.
 * Provides fallback to backup API if primary fails.
 * 
 * @module renderer/services/CurrencyService
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * @constant {string} PRIMARY_API_URL
 * @description Primary currency exchange rate API endpoint
 */
const PRIMARY_API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * @constant {string} BACKUP_API_URL
 * @description Backup currency exchange rate API endpoint
 */
const BACKUP_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

/**
 * @class CurrencyService
 * @description
 * Service for fetching and managing currency exchange rates.
 * Uses USD as base currency and provides conversion rates for other currencies.
 */
class CurrencyService {
  /**
   * @private
   * @type {Object|null}
   * @description Cached currency rates
   */
  #rates = null;

  /**
   * @private
   * @type {Date|null}
   * @description Last update timestamp
   */
  #lastUpdated = null;

  /**
   * Fetch currency rates from APIs
   * 
   * @returns {Promise<boolean>} True if rates were fetched successfully
   * 
   * @description
   * Attempts to fetch rates from primary API first. If that fails,
   * tries the backup API. Caches results on success.
   * 
   * @example
   * const service = new CurrencyService();
   * const success = await service.fetchRates();
   */
  async fetchRates() {
    try {
      const response = await fetch(PRIMARY_API_URL);
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      if (data.result === 'success') {
        this.#rates = data.rates;
        this.#lastUpdated = new Date(data.time_last_update_utc);
        return true;
      }
    } catch (error) {
      console.error('Error fetching currency rates from primary API:', error);
      
      // Try backup API
      try {
        const response = await fetch(BACKUP_API_URL);
        if (!response.ok) throw new Error('Backup API failed');
        
        const data = await response.json();
        this.#rates = data.rates;
        this.#lastUpdated = new Date(data.time_last_update_utc || Date.now());
        return true;
      } catch (backupError) {
        console.error('Backup currency API also failed:', backupError);
      }
    }
    return false;
  }

  /**
   * Get cached currency rates
   * 
   * @returns {Object|null} Currency rates or null if not fetched
   */
  getRates() {
    return this.#rates;
  }

  /**
   * Get last update timestamp
   * 
   * @returns {Date|null} Last update date or null if not fetched
   */
  getLastUpdated() {
    return this.#lastUpdated;
  }

  /**
   * Check if rates are loaded
   * 
   * @returns {boolean} True if rates are available
   */
  hasRates() {
    return this.#rates !== null;
  }

  /**
   * Convert currency amount
   * 
   * @param {number} amount - Amount to convert
   * @param {string} from - Source currency code
   * @param {string} to - Target currency code
   * @returns {number} Converted amount
   * 
   * @example
   * const eur = service.convert(100, 'USD', 'EUR');
   */
  convert(amount, from, to) {
    if (!this.#rates) return 0;
    
    const fromRate = from === 'USD' ? 1 : this.#rates[from];
    const toRate = to === 'USD' ? 1 : this.#rates[to];
    
    if (!fromRate || !toRate) return 0;
    
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
export default currencyService;
