/**
 * @fileoverview Application-wide constants
 * 
 * @description
 * Contains all constant values used throughout the application including
 * timezone data, sync line positioning, and unit conversion data.
 * 
 * @module shared/constants
 * @category shared
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

// ============================================================================
// SYNC LINE CONSTANTS
// ============================================================================

/**
 * @constant {number} SYNC_LINE_POSITION
 * @description Position of sync line as fraction from left (1/6 = ~16.67%)
 */
export const SYNC_LINE_POSITION = 1 / 6;

/**
 * @constant {number} MINUTES_PER_DAY
 * @description Total minutes in a 24-hour day
 */
export const MINUTES_PER_DAY = 1440;

/**
 * @constant {number} MINUTES_PER_48_HOURS
 * @description Total minutes in the 48-hour timeline
 */
export const MINUTES_PER_48_HOURS = 2880;

// ============================================================================
// TIMEZONE DATA
// ============================================================================

/**
 * @constant {Array<Object>} TIMEZONES
 * @description Comprehensive timezone list with IANA names, organized alphabetically
 */
export const TIMEZONES = [
  // Africa
  { value: 'Africa/Abidjan', label: 'Abidjan, Ivory Coast', offset: 0 },
  { value: 'Africa/Accra', label: 'Accra, Ghana', offset: 0 },
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa, Ethiopia', offset: 3 },
  { value: 'Africa/Algiers', label: 'Algiers, Algeria', offset: 1 },
  { value: 'Africa/Cairo', label: 'Cairo, Egypt', offset: 2 },
  { value: 'Africa/Casablanca', label: 'Casablanca, Morocco', offset: 1 },
  { value: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam, Tanzania', offset: 3 },
  { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa', offset: 2 },
  { value: 'Africa/Khartoum', label: 'Khartoum, Sudan', offset: 2 },
  { value: 'Africa/Lagos', label: 'Lagos, Nigeria', offset: 1 },
  { value: 'Africa/Nairobi', label: 'Nairobi, Kenya', offset: 3 },
  { value: 'Africa/Tunis', label: 'Tunis, Tunisia', offset: 1 },

  // Americas - North
  { value: 'America/Anchorage', label: 'Anchorage, USA (Alaska)', offset: -9 },
  { value: 'America/Chicago', label: 'Chicago, USA (Central)', offset: -6 },
  { value: 'America/Denver', label: 'Denver, USA (Mountain)', offset: -7 },
  { value: 'America/Detroit', label: 'Detroit, USA (Eastern)', offset: -5 },
  { value: 'America/Edmonton', label: 'Edmonton, Canada (Mountain)', offset: -7 },
  { value: 'America/Halifax', label: 'Halifax, Canada (Atlantic)', offset: -4 },
  { value: 'America/Honolulu', label: 'Honolulu, USA (Hawaii)', offset: -10 },
  { value: 'America/Los_Angeles', label: 'Los Angeles, USA (Pacific)', offset: -8 },
  { value: 'America/Mexico_City', label: 'Mexico City, Mexico', offset: -6 },
  { value: 'America/New_York', label: 'New York, USA (Eastern)', offset: -5 },
  { value: 'America/Phoenix', label: 'Phoenix, USA (Arizona)', offset: -7 },
  { value: 'America/St_Johns', label: 'St. Johns, Canada (Newfoundland)', offset: -3.5 },
  { value: 'America/Toronto', label: 'Toronto, Canada (Eastern)', offset: -5 },
  { value: 'America/Vancouver', label: 'Vancouver, Canada (Pacific)', offset: -8 },
  { value: 'America/Winnipeg', label: 'Winnipeg, Canada (Central)', offset: -6 },

  // Americas - Central & Caribbean
  { value: 'America/Costa_Rica', label: 'Costa Rica', offset: -6 },
  { value: 'America/Guatemala', label: 'Guatemala', offset: -6 },
  { value: 'America/Havana', label: 'Havana, Cuba', offset: -5 },
  { value: 'America/Jamaica', label: 'Jamaica', offset: -5 },
  { value: 'America/Panama', label: 'Panama', offset: -5 },
  { value: 'America/Puerto_Rico', label: 'Puerto Rico', offset: -4 },
  { value: 'America/Santo_Domingo', label: 'Santo Domingo, Dominican Republic', offset: -4 },

  // Americas - South
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Argentina', offset: -3 },
  { value: 'America/Bogota', label: 'Bogota, Colombia', offset: -5 },
  { value: 'America/Caracas', label: 'Caracas, Venezuela', offset: -4 },
  { value: 'America/La_Paz', label: 'La Paz, Bolivia', offset: -4 },
  { value: 'America/Lima', label: 'Lima, Peru', offset: -5 },
  { value: 'America/Montevideo', label: 'Montevideo, Uruguay', offset: -3 },
  { value: 'America/Santiago', label: 'Santiago, Chile', offset: -3 },
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil', offset: -3 },

  // Asia - East
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 8 },
  { value: 'Asia/Macau', label: 'Macau', offset: 8 },
  { value: 'Asia/Seoul', label: 'Seoul, South Korea', offset: 9 },
  { value: 'Asia/Shanghai', label: 'Shanghai, China', offset: 8 },
  { value: 'Asia/Taipei', label: 'Taipei, Taiwan', offset: 8 },
  { value: 'Asia/Tokyo', label: 'Tokyo, Japan', offset: 9 },
  { value: 'Asia/Ulaanbaatar', label: 'Ulaanbaatar, Mongolia', offset: 8 },

  // Asia - Southeast
  { value: 'Asia/Bangkok', label: 'Bangkok, Thailand', offset: 7 },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City, Vietnam', offset: 7 },
  { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia', offset: 7 },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur, Malaysia', offset: 8 },
  { value: 'Asia/Manila', label: 'Manila, Philippines', offset: 8 },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 8 },

  // Asia - South
  { value: 'Asia/Colombo', label: 'Colombo, Sri Lanka', offset: 5.5 },
  { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh', offset: 6 },
  { value: 'Asia/Karachi', label: 'Karachi, Pakistan', offset: 5 },
  { value: 'Asia/Kathmandu', label: 'Kathmandu, Nepal', offset: 5.75 },
  { value: 'Asia/Kolkata', label: 'Kolkata/Mumbai, India', offset: 5.5 },

  // Asia - Central
  { value: 'Asia/Almaty', label: 'Almaty, Kazakhstan', offset: 6 },
  { value: 'Asia/Tashkent', label: 'Tashkent, Uzbekistan', offset: 5 },

  // Asia - West / Middle East
  { value: 'Asia/Amman', label: 'Amman, Jordan', offset: 3 },
  { value: 'Asia/Baghdad', label: 'Baghdad, Iraq', offset: 3 },
  { value: 'Asia/Bahrain', label: 'Bahrain', offset: 3 },
  { value: 'Asia/Beirut', label: 'Beirut, Lebanon', offset: 2 },
  { value: 'Asia/Damascus', label: 'Damascus, Syria', offset: 3 },
  { value: 'Asia/Dubai', label: 'Dubai, UAE', offset: 4 },
  { value: 'Asia/Jerusalem', label: 'Jerusalem, Israel', offset: 2 },
  { value: 'Asia/Kuwait', label: 'Kuwait', offset: 3 },
  { value: 'Asia/Muscat', label: 'Muscat, Oman', offset: 4 },
  { value: 'Asia/Qatar', label: 'Qatar', offset: 3 },
  { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia', offset: 3 },
  { value: 'Asia/Tehran', label: 'Tehran, Iran', offset: 3.5 },

  // Australia & Pacific
  { value: 'Australia/Adelaide', label: 'Adelaide, Australia', offset: 9.5 },
  { value: 'Australia/Brisbane', label: 'Brisbane, Australia', offset: 10 },
  { value: 'Australia/Darwin', label: 'Darwin, Australia', offset: 9.5 },
  { value: 'Australia/Hobart', label: 'Hobart, Australia', offset: 10 },
  { value: 'Australia/Melbourne', label: 'Melbourne, Australia', offset: 10 },
  { value: 'Australia/Perth', label: 'Perth, Australia', offset: 8 },
  { value: 'Australia/Sydney', label: 'Sydney, Australia', offset: 10 },
  { value: 'Pacific/Auckland', label: 'Auckland, New Zealand', offset: 12 },
  { value: 'Pacific/Fiji', label: 'Fiji', offset: 12 },
  { value: 'Pacific/Guam', label: 'Guam', offset: 10 },
  { value: 'Pacific/Noumea', label: 'Noumea, New Caledonia', offset: 11 },
  { value: 'Pacific/Port_Moresby', label: 'Port Moresby, Papua New Guinea', offset: 10 },
  { value: 'Pacific/Tahiti', label: 'Tahiti, French Polynesia', offset: -10 },

  // Europe - Western
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik, Iceland', offset: 0 },
  { value: 'Europe/Dublin', label: 'Dublin, Ireland', offset: 0 },
  { value: 'Europe/Lisbon', label: 'Lisbon, Portugal', offset: 0 },
  { value: 'Europe/London', label: 'London, UK', offset: 0 },

  // Europe - Central
  { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands', offset: 1 },
  { value: 'Europe/Berlin', label: 'Berlin, Germany', offset: 1 },
  { value: 'Europe/Brussels', label: 'Brussels, Belgium', offset: 1 },
  { value: 'Europe/Budapest', label: 'Budapest, Hungary', offset: 1 },
  { value: 'Europe/Copenhagen', label: 'Copenhagen, Denmark', offset: 1 },
  { value: 'Europe/Madrid', label: 'Madrid, Spain', offset: 1 },
  { value: 'Europe/Oslo', label: 'Oslo, Norway', offset: 1 },
  { value: 'Europe/Paris', label: 'Paris, France', offset: 1 },
  { value: 'Europe/Prague', label: 'Prague, Czech Republic', offset: 1 },
  { value: 'Europe/Rome', label: 'Rome, Italy', offset: 1 },
  { value: 'Europe/Stockholm', label: 'Stockholm, Sweden', offset: 1 },
  { value: 'Europe/Vienna', label: 'Vienna, Austria', offset: 1 },
  { value: 'Europe/Warsaw', label: 'Warsaw, Poland', offset: 1 },
  { value: 'Europe/Zurich', label: 'Zurich, Switzerland', offset: 1 },

  // Europe - Eastern
  { value: 'Europe/Athens', label: 'Athens, Greece', offset: 2 },
  { value: 'Europe/Bucharest', label: 'Bucharest, Romania', offset: 2 },
  { value: 'Europe/Helsinki', label: 'Helsinki, Finland', offset: 2 },
  { value: 'Europe/Istanbul', label: 'Istanbul, Turkey', offset: 3 },
  { value: 'Europe/Kiev', label: 'Kyiv, Ukraine', offset: 2 },
  { value: 'Europe/Moscow', label: 'Moscow, Russia', offset: 3 },
  { value: 'Europe/Riga', label: 'Riga, Latvia', offset: 2 },
  { value: 'Europe/Sofia', label: 'Sofia, Bulgaria', offset: 2 },
  { value: 'Europe/Tallinn', label: 'Tallinn, Estonia', offset: 2 },
  { value: 'Europe/Vilnius', label: 'Vilnius, Lithuania', offset: 2 },

  // Atlantic
  { value: 'Atlantic/Azores', label: 'Azores, Portugal', offset: -1 },
  { value: 'Atlantic/Cape_Verde', label: 'Cape Verde', offset: -1 },

  // Indian Ocean
  { value: 'Indian/Maldives', label: 'Maldives', offset: 5 },
  { value: 'Indian/Mauritius', label: 'Mauritius', offset: 4 },
];

// ============================================================================
// CONVERSION UNITS DATA
// ============================================================================

/**
 * @constant {Object} CONVERSION_UNITS
 * @description Unit conversion data for temperature, currency, length, and weight
 */
export const CONVERSION_UNITS = {
  temperature: {
    units: [
      { value: 'celsius', label: 'Celsius (°C)' },
      { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
      { value: 'kelvin', label: 'Kelvin (K)' }
    ],
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit'
  },
  currency: {
    units: [
      { value: 'USD', label: 'US Dollar (USD)' },
      { value: 'EUR', label: 'Euro (EUR)' },
      { value: 'GBP', label: 'British Pound (GBP)' },
      { value: 'JPY', label: 'Japanese Yen (JPY)' },
      { value: 'AUD', label: 'Australian Dollar (AUD)' },
      { value: 'CAD', label: 'Canadian Dollar (CAD)' },
      { value: 'CHF', label: 'Swiss Franc (CHF)' },
      { value: 'CNY', label: 'Chinese Yuan (CNY)' },
      { value: 'INR', label: 'Indian Rupee (INR)' },
      { value: 'KRW', label: 'South Korean Won (KRW)' },
      { value: 'MXN', label: 'Mexican Peso (MXN)' },
      { value: 'BRL', label: 'Brazilian Real (BRL)' },
      { value: 'SGD', label: 'Singapore Dollar (SGD)' },
      { value: 'HKD', label: 'Hong Kong Dollar (HKD)' },
      { value: 'NZD', label: 'New Zealand Dollar (NZD)' }
    ],
    defaultFrom: 'USD',
    defaultTo: 'AUD'
  },
  length: {
    units: [
      { value: 'meter', label: 'Meters (m)' },
      { value: 'kilometer', label: 'Kilometers (km)' },
      { value: 'centimeter', label: 'Centimeters (cm)' },
      { value: 'millimeter', label: 'Millimeters (mm)' },
      { value: 'mile', label: 'Miles (mi)' },
      { value: 'yard', label: 'Yards (yd)' },
      { value: 'foot', label: 'Feet (ft)' },
      { value: 'inch', label: 'Inches (in)' }
    ],
    defaultFrom: 'kilometer',
    defaultTo: 'mile'
  },
  weight: {
    units: [
      { value: 'kilogram', label: 'Kilograms (kg)' },
      { value: 'gram', label: 'Grams (g)' },
      { value: 'milligram', label: 'Milligrams (mg)' },
      { value: 'pound', label: 'Pounds (lb)' },
      { value: 'ounce', label: 'Ounces (oz)' },
      { value: 'stone', label: 'Stone (st)' }
    ],
    defaultFrom: 'kilogram',
    defaultTo: 'pound'
  }
};

/**
 * @constant {Object} LENGTH_TO_METER
 * @description Conversion factors from each length unit to meters
 */
export const LENGTH_TO_METER = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254
};

/**
 * @constant {Object} WEIGHT_TO_GRAM
 * @description Conversion factors from each weight unit to grams
 */
export const WEIGHT_TO_GRAM = {
  kilogram: 1000,
  gram: 1,
  milligram: 0.001,
  pound: 453.592,
  ounce: 28.3495,
  stone: 6350.29
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * @constant {Object} DEFAULT_CONFIG
 * @description Default application configuration
 */
export const DEFAULT_CONFIG = {
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
