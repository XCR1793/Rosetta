/**
 * @fileoverview Unit Converter Component
 * 
 * @description
 * Renders the unit converter panel for temperature, currency,
 * length, and weight conversions.
 * 
 * @module renderer/components/features/Converter
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { CONVERSION_UNITS } from '../../../shared/constants/index.js';
import { convertTemperature, convertLength, convertWeight, formatConversionResult } from '../../../shared/utils/conversion.js';
import { currencyService } from '../../services/CurrencyService.js';
import { store } from '../../store/Store.js';

/**
 * @class ConverterComponent
 * @description
 * Manages the unit converter panel functionality.
 * Supports temperature, currency, length, and weight conversions.
 */
class ConverterComponent {
  /**
   * @private
   * @type {HTMLElement}
   * @description Converter panel element
   */
  #panel = null;

  /**
   * @private
   * @type {string}
   * @description Current converter type
   */
  #converterType = 'temperature';

  /**
   * Create a ConverterComponent
   * 
   * @param {HTMLElement} panel - Converter panel element
   */
  constructor(panel) {
    this.#panel = panel;
    this.#setupEventListeners();
  }

  /**
   * Setup event listeners for converter panel
   * 
   * @private
   */
  #setupEventListeners() {
    // Type buttons
    this.#panel.querySelectorAll('.converter-type-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchType(btn.dataset.type));
    });

    // Input change
    const fromValue = this.#panel.querySelector('#converterFromValue');
    fromValue?.addEventListener('input', () => this.performConversion());

    // Unit selection changes
    const fromUnit = this.#panel.querySelector('#converterFromUnit');
    const toUnit = this.#panel.querySelector('#converterToUnit');

    fromUnit?.addEventListener('change', () => {
      this.performConversion();
      this.#savePreferences();
    });

    toUnit?.addEventListener('change', () => {
      this.performConversion();
      this.#savePreferences();
    });

    // Swap button
    const swapBtn = this.#panel.querySelector('#swapUnitsBtn');
    swapBtn?.addEventListener('click', () => this.swapUnits());
  }

  /**
   * Open the converter panel
   */
  async open() {
    this.#panel.classList.add('open');
    
    // Initialize converter if needed
    if (this.#converterType === 'currency' && !currencyService.hasRates()) {
      await currencyService.fetchRates();
    }
    this.populateDropdowns();
  }

  /**
   * Close the converter panel
   */
  close() {
    this.#panel.classList.remove('open');
  }

  /**
   * Check if converter is open
   * 
   * @returns {boolean} True if panel is open
   */
  isOpen() {
    return this.#panel.classList.contains('open');
  }

  /**
   * Switch converter type
   * 
   * @param {string} type - Converter type ('temperature', 'currency', 'length', 'weight')
   */
  async switchType(type) {
    this.#converterType = type;
    store.set('converterType', type);

    // Update button states
    this.#panel.querySelectorAll('.converter-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });

    // Fetch currency rates if needed
    if (type === 'currency' && !currencyService.hasRates()) {
      await currencyService.fetchRates();
    }

    this.populateDropdowns();
    this.#updateCurrencyRateInfo();
  }

  /**
   * Populate unit dropdowns based on converter type
   */
  populateDropdowns() {
    const fromSelect = this.#panel.querySelector('#converterFromUnit');
    const toSelect = this.#panel.querySelector('#converterToUnit');
    const units = CONVERSION_UNITS[this.#converterType];

    if (!fromSelect || !toSelect || !units) return;

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    units.units.forEach(unit => {
      const fromOption = document.createElement('option');
      fromOption.value = unit.value;
      fromOption.textContent = unit.label;
      fromSelect.appendChild(fromOption);

      const toOption = document.createElement('option');
      toOption.value = unit.value;
      toOption.textContent = unit.label;
      toSelect.appendChild(toOption);
    });

    // Set defaults from config or use defaults
    const config = store.get('config');
    const savedPrefs = config?.converterPreferences?.[this.#converterType];
    fromSelect.value = savedPrefs?.fromUnit || units.defaultFrom;
    toSelect.value = savedPrefs?.toUnit || units.defaultTo;

    this.performConversion();
  }

  /**
   * Perform unit conversion
   */
  performConversion() {
    const fromValue = parseFloat(this.#panel.querySelector('#converterFromValue')?.value);
    const fromUnit = this.#panel.querySelector('#converterFromUnit')?.value;
    const toUnit = this.#panel.querySelector('#converterToUnit')?.value;
    const toValueEl = this.#panel.querySelector('#converterToValue');

    if (isNaN(fromValue) || !fromUnit || !toUnit || !toValueEl) {
      if (toValueEl) toValueEl.value = '';
      return;
    }

    let result;
    switch (this.#converterType) {
      case 'temperature':
        result = convertTemperature(fromValue, fromUnit, toUnit);
        break;
      case 'currency':
        result = currencyService.convert(fromValue, fromUnit, toUnit);
        break;
      case 'length':
        result = convertLength(fromValue, fromUnit, toUnit);
        break;
      case 'weight':
        result = convertWeight(fromValue, fromUnit, toUnit);
        break;
      default:
        result = fromValue;
    }

    toValueEl.value = formatConversionResult(result);
    this.#updateCurrencyRateInfo();
  }

  /**
   * Swap from and to units
   */
  swapUnits() {
    const fromSelect = this.#panel.querySelector('#converterFromUnit');
    const toSelect = this.#panel.querySelector('#converterToUnit');
    const fromValue = this.#panel.querySelector('#converterFromValue');
    const toValue = this.#panel.querySelector('#converterToValue');

    if (!fromSelect || !toSelect || !fromValue || !toValue) return;

    // Swap unit selections
    const tempUnit = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempUnit;

    // Move result to input
    fromValue.value = toValue.value;

    this.performConversion();
    this.#savePreferences();
  }

  /**
   * Update currency rate info display
   * 
   * @private
   */
  #updateCurrencyRateInfo() {
    const rateInfo = this.#panel.querySelector('#currencyRateInfo');
    if (!rateInfo) return;

    if (this.#converterType === 'currency' && currencyService.hasRates()) {
      const fromUnit = this.#panel.querySelector('#converterFromUnit')?.value;
      const toUnit = this.#panel.querySelector('#converterToUnit')?.value;
      
      if (fromUnit && toUnit) {
        const rate = currencyService.convert(1, fromUnit, toUnit);
        rateInfo.querySelector('.rate-text').textContent = `1 ${fromUnit} = ${rate.toFixed(4)} ${toUnit}`;
        
        const lastUpdated = currencyService.getLastUpdated();
        rateInfo.querySelector('.rate-updated').textContent = lastUpdated
          ? `Updated: ${lastUpdated.toLocaleDateString()}`
          : '';
        rateInfo.style.display = 'block';
      }
    } else {
      rateInfo.style.display = 'none';
    }
  }

  /**
   * Save converter preferences to config
   * 
   * @private
   */
  async #savePreferences() {
    const config = store.get('config');
    if (!config) return;

    if (!config.converterPreferences) {
      config.converterPreferences = {};
    }
    
    config.converterPreferences[this.#converterType] = {
      fromUnit: this.#panel.querySelector('#converterFromUnit')?.value,
      toUnit: this.#panel.querySelector('#converterToUnit')?.value
    };
    
    store.set('config', config);
    await window.electronAPI.saveConfig(config);
  }
}

export { ConverterComponent };
export default ConverterComponent;
