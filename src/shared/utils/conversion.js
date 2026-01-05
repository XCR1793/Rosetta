/**
 * @fileoverview Unit conversion utility functions
 * 
 * @description
 * Provides utility functions for converting between different units
 * including temperature, length, weight, and currency.
 * 
 * @module shared/utils/conversion
 * @category shared
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { LENGTH_TO_METER, WEIGHT_TO_GRAM } from '../constants/index.js';

/**
 * Convert temperature between Celsius, Fahrenheit, and Kelvin
 * 
 * @param {number} value - Temperature value to convert
 * @param {string} from - Source unit ('celsius', 'fahrenheit', 'kelvin')
 * @param {string} to - Target unit ('celsius', 'fahrenheit', 'kelvin')
 * @returns {number} Converted temperature value
 * 
 * @example
 * convertTemperature(100, 'celsius', 'fahrenheit'); // Returns 212
 * convertTemperature(32, 'fahrenheit', 'celsius'); // Returns 0
 */
export function convertTemperature(value, from, to) {
  // Convert to Celsius first
  let celsius;
  switch (from) {
    case 'celsius': celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5/9; break;
    case 'kelvin': celsius = value - 273.15; break;
    default: return value;
  }
  // Convert from Celsius to target
  switch (to) {
    case 'celsius': return celsius;
    case 'fahrenheit': return celsius * 9/5 + 32;
    case 'kelvin': return celsius + 273.15;
    default: return value;
  }
}

/**
 * Convert length between different units
 * 
 * @param {number} value - Length value to convert
 * @param {string} from - Source unit
 * @param {string} to - Target unit
 * @returns {number} Converted length value
 * 
 * @example
 * convertLength(1, 'kilometer', 'mile'); // Returns ~0.621
 */
export function convertLength(value, from, to) {
  const meters = value * LENGTH_TO_METER[from];
  return meters / LENGTH_TO_METER[to];
}

/**
 * Convert weight between different units
 * 
 * @param {number} value - Weight value to convert
 * @param {string} from - Source unit
 * @param {string} to - Target unit
 * @returns {number} Converted weight value
 * 
 * @example
 * convertWeight(1, 'kilogram', 'pound'); // Returns ~2.205
 */
export function convertWeight(value, from, to) {
  const grams = value * WEIGHT_TO_GRAM[from];
  return grams / WEIGHT_TO_GRAM[to];
}

/**
 * Convert currency using provided rates
 * 
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {Object} rates - Currency rates object (USD-based)
 * @returns {number} Converted currency amount
 * 
 * @example
 * convertCurrency(100, 'USD', 'EUR', rates); // Returns converted amount
 */
export function convertCurrency(amount, from, to, rates) {
  if (!rates) return 0;
  // Rates are based on USD
  const fromRate = from === 'USD' ? 1 : rates[from];
  const toRate = to === 'USD' ? 1 : rates[to];
  if (!fromRate || !toRate) return 0;
  // Convert to USD first, then to target
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

/**
 * Format conversion result based on magnitude
 * 
 * @param {number} result - Conversion result to format
 * @returns {string} Formatted result string
 * 
 * @example
 * formatConversionResult(0.000123); // Returns "1.2300e-4"
 * formatConversionResult(1234567); // Returns "1.2346e+6"
 * formatConversionResult(123.456); // Returns "123.456"
 */
export function formatConversionResult(result) {
  if (Math.abs(result) < 0.01 && result !== 0) {
    return result.toExponential(4);
  } else if (Math.abs(result) >= 1000000) {
    return result.toExponential(4);
  }
  return parseFloat(result.toFixed(6)).toString();
}
