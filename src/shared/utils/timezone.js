/**
 * @fileoverview Timezone utility functions
 * 
 * @description
 * Provides utility functions for timezone calculations, including
 * getting current offsets, formatting offsets, and filtering timezones.
 * 
 * @module shared/utils/timezone
 * @category shared
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { TIMEZONES } from '../constants/index.js';

/**
 * Get the current GMT offset for a timezone (accounts for DST)
 * 
 * @param {string} timezone - IANA timezone identifier
 * @returns {number} Offset in hours from UTC
 * 
 * @example
 * const offset = getCurrentOffset('America/New_York'); // Returns -5 or -4 depending on DST
 */
export function getCurrentOffset(timezone) {
  try {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const diffMs = tzDate - utcDate;
    return diffMs / (1000 * 60 * 60);
  } catch (e) {
    console.error('Invalid timezone:', timezone, e);
    return 0;
  }
}

/**
 * Format offset as GMT string
 * 
 * @param {number} offset - Offset in hours
 * @returns {string} Formatted offset string (e.g., "GMT+10" or "GMT-5:30")
 * 
 * @example
 * formatOffset(10); // Returns "GMT+10"
 * formatOffset(-5.5); // Returns "GMT-5:30"
 */
export function formatOffset(offset) {
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = (absOffset % 1) * 60;
  if (minutes === 0) {
    return `GMT${sign}${hours}`;
  }
  return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get timezones filtered by offset
 * 
 * @param {number|null|undefined|string} targetOffset - Target GMT offset to filter by
 * @returns {Array<Object>} Filtered array of timezone objects
 * 
 * @example
 * const sydneyTimezones = getTimezonesByOffset(10);
 */
export function getTimezonesByOffset(targetOffset) {
  if (targetOffset === null || targetOffset === undefined || targetOffset === '') {
    return TIMEZONES;
  }
  const target = parseFloat(targetOffset);
  if (isNaN(target)) {
    return TIMEZONES;
  }
  return TIMEZONES.filter(tz => {
    const currentOffset = getCurrentOffset(tz.value);
    return Math.abs(currentOffset - target) < 0.1;
  });
}

/**
 * Get current time in a specific timezone
 * 
 * @param {string} timezone - IANA timezone identifier
 * @returns {Date} Date object representing current time in the timezone
 * 
 * @example
 * const tokyoTime = getTimeInTimezone('Asia/Tokyo');
 */
export function getTimeInTimezone(timezone) {
  try {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  } catch (e) {
    console.error('Invalid timezone in getTimeInTimezone:', timezone, e);
    return new Date();
  }
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 * 
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {number} Minutes since midnight
 * 
 * @example
 * timeToMinutes('09:30'); // Returns 570
 */
export function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format time for display
 * 
 * @param {Date} date - Date object to format
 * @param {boolean} use24Hour - Whether to use 24-hour format
 * @returns {string} Formatted time string
 * 
 * @example
 * formatTime(new Date(), true); // Returns "14:30:00"
 * formatTime(new Date(), false); // Returns "2:30:00 PM"
 */
export function formatTime(date, use24Hour = false) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour
  });
}

/**
 * Format date for display
 * 
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "Mon, Jan 6")
 * 
 * @example
 * formatDate(new Date()); // Returns "Mon, Jan 6"
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
