// Comprehensive timezone list with IANA names, organized alphabetically by country/region
const TIMEZONES = [
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

// Sync line position (1/6 from left = ~16.67%)
const SYNC_LINE_POSITION = 1 / 6;

// Timeline offset in minutes (how much to shift the timeline view)
let timelineOffset = 0;

// Time format: true = 24h, false = 12h (AM/PM)
let use24Hour = false;

// Compact mode
let compactMode = false;

// Sync mode: true = timelines synced to current time, false = standard 12am-12am view
let syncMode = true;

// Converter state
let converterType = 'temperature';
let converterFromUnit = '';
let converterToUnit = '';
let currencyRates = null;
let currencyRatesLastUpdated = null;

// Unit conversion data
const CONVERSION_UNITS = {
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

// Length conversions to meters
const LENGTH_TO_METER = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254
};

// Weight conversions to grams
const WEIGHT_TO_GRAM = {
  kilogram: 1000,
  gram: 1,
  milligram: 0.001,
  pound: 453.592,
  ounce: 28.3495,
  stone: 6350.29
};

// Get the current GMT offset for a timezone (accounts for DST)
function getCurrentOffset(timezone) {
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

// Format offset as GMT string
function formatOffset(offset) {
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = (absOffset % 1) * 60;
  if (minutes === 0) {
    return `GMT${sign}${hours}`;
  }
  return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Get timezones filtered by offset
function getTimezonesByOffset(targetOffset) {
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

let config = null;

// Fetch currency rates from API
async function fetchCurrencyRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch rates');
    const data = await response.json();
    if (data.result === 'success') {
      currencyRates = data.rates;
      currencyRatesLastUpdated = new Date(data.time_last_update_utc);
      updateCurrencyRateInfo();
      return true;
    }
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    // Try backup API
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Backup API failed');
      const data = await response.json();
      currencyRates = data.rates;
      currencyRatesLastUpdated = new Date(data.time_last_update_utc || Date.now());
      updateCurrencyRateInfo();
      return true;
    } catch (backupError) {
      console.error('Backup currency API also failed:', backupError);
    }
  }
  return false;
}

// Update currency rate info display
function updateCurrencyRateInfo() {
  const rateInfo = document.getElementById('currencyRateInfo');
  if (!rateInfo) return;

  if (converterType === 'currency' && currencyRates) {
    const fromUnit = document.getElementById('converterFromUnit').value;
    const toUnit = document.getElementById('converterToUnit').value;
    if (fromUnit && toUnit) {
      const rate = convertCurrency(1, fromUnit, toUnit);
      rateInfo.querySelector('.rate-text').textContent = `1 ${fromUnit} = ${rate.toFixed(4)} ${toUnit}`;
      rateInfo.querySelector('.rate-updated').textContent = currencyRatesLastUpdated
        ? `Updated: ${currencyRatesLastUpdated.toLocaleDateString()}`
        : '';
      rateInfo.style.display = 'block';
    }
  } else {
    rateInfo.style.display = 'none';
  }
}

// Convert currency using fetched rates
function convertCurrency(amount, from, to) {
  if (!currencyRates) return 0;
  // Rates are based on USD
  const fromRate = from === 'USD' ? 1 : currencyRates[from];
  const toRate = to === 'USD' ? 1 : currencyRates[to];
  if (!fromRate || !toRate) return 0;
  // Convert to USD first, then to target
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

// Convert temperature
function convertTemperature(value, from, to) {
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

// Convert length
function convertLength(value, from, to) {
  const meters = value * LENGTH_TO_METER[from];
  return meters / LENGTH_TO_METER[to];
}

// Convert weight
function convertWeight(value, from, to) {
  const grams = value * WEIGHT_TO_GRAM[from];
  return grams / WEIGHT_TO_GRAM[to];
}

// Perform conversion
function performConversion() {
  const fromValue = parseFloat(document.getElementById('converterFromValue').value);
  const fromUnit = document.getElementById('converterFromUnit').value;
  const toUnit = document.getElementById('converterToUnit').value;
  const toValueEl = document.getElementById('converterToValue');

  if (isNaN(fromValue) || !fromUnit || !toUnit) {
    toValueEl.value = '';
    return;
  }

  let result;
  switch (converterType) {
    case 'temperature':
      result = convertTemperature(fromValue, fromUnit, toUnit);
      break;
    case 'currency':
      result = convertCurrency(fromValue, fromUnit, toUnit);
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

  // Format result based on magnitude
  if (Math.abs(result) < 0.01 && result !== 0) {
    toValueEl.value = result.toExponential(4);
  } else if (Math.abs(result) >= 1000000) {
    toValueEl.value = result.toExponential(4);
  } else {
    toValueEl.value = parseFloat(result.toFixed(6));
  }

  updateCurrencyRateInfo();
}

// Populate converter dropdowns
function populateConverterDropdowns() {
  const fromSelect = document.getElementById('converterFromUnit');
  const toSelect = document.getElementById('converterToUnit');
  const units = CONVERSION_UNITS[converterType];

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
  const savedPrefs = config.converterPreferences?.[converterType];
  fromSelect.value = savedPrefs?.fromUnit || units.defaultFrom;
  toSelect.value = savedPrefs?.toUnit || units.defaultTo;

  converterFromUnit = fromSelect.value;
  converterToUnit = toSelect.value;

  performConversion();
}

// Switch converter type
async function switchConverterType(type) {
  converterType = type;

  // Update button states
  document.querySelectorAll('.converter-type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  // Fetch currency rates if needed
  if (type === 'currency' && !currencyRates) {
    await fetchCurrencyRates();
  }

  populateConverterDropdowns();
  updateCurrencyRateInfo();
}

// Swap units
function swapUnits() {
  const fromSelect = document.getElementById('converterFromUnit');
  const toSelect = document.getElementById('converterToUnit');
  const fromValue = document.getElementById('converterFromValue');
  const toValue = document.getElementById('converterToValue');

  // Swap unit selections
  const tempUnit = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tempUnit;

  // Move result to input
  fromValue.value = toValue.value;

  converterFromUnit = fromSelect.value;
  converterToUnit = toSelect.value;

  performConversion();
  saveConverterPreferences();
}

// Save converter preferences
async function saveConverterPreferences() {
  if (!config.converterPreferences) {
    config.converterPreferences = {};
  }
  config.converterPreferences[converterType] = {
    fromUnit: document.getElementById('converterFromUnit').value,
    toUnit: document.getElementById('converterToUnit').value
  };
  await window.electronAPI.saveConfig(config);
}

// Setup converter event listeners
function setupConverterListeners() {
  // Converter button
  document.getElementById('converterBtn').addEventListener('click', async () => {
    const panel = document.getElementById('converterPanel');
    panel.classList.add('open');
    config.converterOpen = true;
    await window.electronAPI.saveConfig(config);

    // Initialize converter if needed
    if (converterType === 'currency' && !currencyRates) {
      await fetchCurrencyRates();
    }
    populateConverterDropdowns();
  });

  // Close converter button
  document.getElementById('closeConverterBtn').addEventListener('click', async () => {
    document.getElementById('converterPanel').classList.remove('open');
    config.converterOpen = false;
    await window.electronAPI.saveConfig(config);
  });

  // Converter type buttons
  document.querySelectorAll('.converter-type-btn').forEach(btn => {
    btn.addEventListener('click', () => switchConverterType(btn.dataset.type));
  });

  // Input change
  document.getElementById('converterFromValue').addEventListener('input', performConversion);

  // Unit selection changes
  document.getElementById('converterFromUnit').addEventListener('change', () => {
    converterFromUnit = document.getElementById('converterFromUnit').value;
    performConversion();
    saveConverterPreferences();
  });

  document.getElementById('converterToUnit').addEventListener('change', () => {
    converterToUnit = document.getElementById('converterToUnit').value;
    performConversion();
    saveConverterPreferences();
  });

  // Swap button
  document.getElementById('swapUnitsBtn').addEventListener('click', swapUnits);
}

// Initialize
async function init() {
  try {
    config = await window.electronAPI.getConfig();

    // Load saved preferences
    use24Hour = config.use24Hour || false;
    compactMode = config.compactMode || false;
    syncMode = config.syncMode !== false; // default to true
    updateTimeFormatButton();
    updateCompactMode();
    updateSyncButton();

    renderTimelines();
    renderSettings();
    startClock();
    setupEventListeners();
    setupConverterListeners();
    initThemeSystem();

    // Auto-sync on start
    syncTimelines();

    // Restore converter panel state
    if (config.converterOpen) {
      document.getElementById('converterPanel').classList.add('open');
      if (converterType === 'currency') {
        await fetchCurrencyRates();
      }
      populateConverterDropdowns();
    }
  } catch (error) {
    console.error('Init error:', error);
    alert('Error initializing app: ' + error.message);
  }
}

// Render timeline rows
function renderTimelines() {
  const container = document.getElementById('timelinesContainer');
  container.innerHTML = '';

  config.timelines.forEach(timeline => {
    const row = createTimelineRow(timeline);
    container.appendChild(row);
  });

  // Add legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-color sleep"></div>
      <span>Sleeping</span>
    </div>
    <div class="legend-item">
      <div class="legend-color awake"></div>
      <span>Awake</span>
    </div>
    <div class="legend-item">
      <div class="legend-color work"></div>
      <span>Working</span>
    </div>
  `;
  container.appendChild(legend);
}

// Create a timeline row element
function createTimelineRow(timeline) {
  const row = document.createElement('div');
  row.className = 'timeline-row';
  row.dataset.id = timeline.id;

  const offset = getCurrentOffset(timeline.timezone);
  const offsetStr = formatOffset(offset);

  row.innerHTML = `
    <div class="timeline-header">
      <span class="timeline-name">${timeline.name} <span style="color: #666; font-size: 11px;">(${offsetStr})</span></span>
      <div>
        <span class="timeline-time" data-tz="${timeline.timezone}">--:--:--</span>
        <span class="timeline-date" data-tz-date="${timeline.timezone}"></span>
      </div>
    </div>
    <div class="timeline-bar-container" data-timezone="${timeline.timezone}">
      <div class="timeline-bar" data-timeline-id="${timeline.id}" data-timezone="${timeline.timezone}"></div>
      <div class="hour-labels" data-timezone="${timeline.timezone}"></div>
    </div>
  `;

  // Build the complete timeline in one pass
  buildTimeline(row, timeline);

  return row;
}

/**
 * Build complete timeline with schedule blocks, current time indicator, and hour labels
 * All elements are positioned relative to the same 48-hour coordinate system
 */
function buildTimeline(row, timeline) {
  const bar = row.querySelector('.timeline-bar');
  const labelsContainer = row.querySelector('.hour-labels');
  const barContainer = row.querySelector('.timeline-bar-container');
  
  bar.innerHTML = '';
  labelsContainer.innerHTML = '';

  // Constants for 48-hour timeline
  const MINUTES_48H = 2880;
  const MINUTES_24H = 1440;

  // Parse schedule times
  const wakeMinutes = timeToMinutes(timeline.wakeTime);
  const sleepMinutes = timeToMinutes(timeline.sleepTime);
  const workStartMinutes = timeToMinutes(timeline.workStart);
  const workEndMinutes = timeToMinutes(timeline.workEnd);

  // Get current time in this timezone
  const currentTime = getTimeInTimezone(timeline.timezone);
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // =========================================================================
  // STEP 1: Generate schedule segments for 48-hour period
  // =========================================================================
  const segments = generateScheduleSegments(
    wakeMinutes, sleepMinutes, workStartMinutes, workEndMinutes
  );

  // Render schedule blocks
  segments.forEach(seg => {
    if (seg.start < seg.end) {
      const block = document.createElement('div');
      block.className = `schedule-block ${seg.type}`;
      block.style.left = `${(seg.start / MINUTES_48H) * 100}%`;
      block.style.width = `${((seg.end - seg.start) / MINUTES_48H) * 100}%`;
      bar.appendChild(block);
    }
  });

  // =========================================================================
  // STEP 2: Add current time indicator (positioned in same coordinate system)
  // =========================================================================
  const indicator = document.createElement('div');
  indicator.className = 'current-time-indicator';
  indicator.dataset.tz = timeline.timezone;
  // Position at current time in Day 1 (0-1440 maps to 0-50% of bar)
  indicator.style.left = `${(currentMinutes / MINUTES_48H) * 100}%`;
  bar.appendChild(indicator);

  // =========================================================================
  // STEP 3: Generate hour labels (same coordinate system)
  // =========================================================================
  for (let h = 0; h < 48; h += 3) {
    const label = document.createElement('span');
    label.className = 'hour-label';
    const hour = h % 24;
    
    if (use24Hour) {
      label.textContent = `${hour.toString().padStart(2, '0')}`;
    } else {
      if (hour === 0) {
        label.textContent = '12a';
      } else if (hour === 12) {
        label.textContent = '12p';
      } else if (hour < 12) {
        label.textContent = `${hour}a`;
      } else {
        label.textContent = `${hour - 12}p`;
      }
    }
    
    label.style.position = 'absolute';
    label.style.left = `${(h / 48) * 100}%`;
    label.style.transform = 'translateX(-50%)';
    labelsContainer.appendChild(label);
  }
}

/**
 * Generate schedule segments for a 48-hour period
 * Returns array of {start, end, type} objects
 */
function generateScheduleSegments(wakeMinutes, sleepMinutes, workStartMinutes, workEndMinutes) {
  const MINUTES_24H = 1440;
  const MINUTES_48H = 2880;
  
  // Priority for overlapping segments: work > awake > sleep
  const priority = { work: 3, awake: 2, sleep: 1 };
  
  // Create minute-by-minute map for 48 hours (default to sleep)
  const minuteMap = new Array(MINUTES_48H).fill('sleep');
  
  // Helper to set a range in the map (respects priority)
  function setRange(start, end, type) {
    for (let m = Math.max(0, start); m < Math.min(end, MINUTES_48H); m++) {
      if (priority[type] > priority[minuteMap[m]]) {
        minuteMap[m] = type;
      }
    }
  }
  
  // Determine if schedules cross midnight
  const sleepCrossesMidnight = sleepMinutes < wakeMinutes; // e.g., sleep 2am, wake 8am
  const workCrossesMidnight = workEndMinutes < workStartMinutes; // e.g., work 10pm-3am
  
  // Process each of the 2 days in our 48-hour timeline
  for (let day = 0; day < 2; day++) {
    const base = day * MINUTES_24H;
    
    // Set awake periods
    if (!sleepCrossesMidnight) {
      // Normal: wake at 8am, sleep at 11pm
      // Awake from wake until sleep on the same day
      setRange(base + wakeMinutes, base + sleepMinutes, 'awake');
    } else {
      // Sleep crosses midnight: sleep at 2am, wake at 8am
      // This means awake from 8am until midnight, then midnight until 2am
      // Day 0: awake 8am-midnight, then awake midnight-2am (but 2am is next day boundary)
      setRange(base + wakeMinutes, base + MINUTES_24H, 'awake'); // wake until midnight
      setRange(base, base + sleepMinutes, 'awake'); // midnight until sleep (this day's early hours)
    }
    
    // Set work periods (overrides awake)
    if (!workCrossesMidnight) {
      // Normal: work 9am-5pm
      setRange(base + workStartMinutes, base + workEndMinutes, 'work');
    } else {
      // Work crosses midnight: work 10pm-3am
      setRange(base + workStartMinutes, base + MINUTES_24H, 'work'); // work start until midnight
      setRange(base, base + workEndMinutes, 'work'); // midnight until work end (this day's early hours)
    }
  }
  
  // Convert minute map back to segments
  const segments = [];
  let currentSeg = null;
  
  for (let m = 0; m < MINUTES_48H; m++) {
    const type = minuteMap[m];
    
    if (!currentSeg || currentSeg.type !== type) {
      if (currentSeg) {
        currentSeg.end = m;
        segments.push(currentSeg);
      }
      currentSeg = { start: m, end: m + 1, type };
    }
  }
  
  if (currentSeg) {
    currentSeg.end = MINUTES_48H;
    segments.push(currentSeg);
  }
  
  return segments;
}

// Convert time string (HH:MM) to minutes since midnight
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Get current time in a timezone
function getTimeInTimezone(timezone) {
  try {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  } catch (e) {
    console.error('Invalid timezone in getTimeInTimezone:', timezone, e);
    return new Date();
  }
}

// Format time for display
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour
  });
}

// Format date for display
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Sync timelines - first timeline stays fixed, others align their current time to match first timeline's position
function syncTimelines() {
  if (!config || !config.timelines.length) return;

  const MINUTES_48H = 2880;
  const rows = document.querySelectorAll('.timeline-row');
  
  if (rows.length === 0) return;

  // Get the first timeline's current time position (this is our reference)
  const firstRow = rows[0];
  const firstBar = firstRow.querySelector('.timeline-bar');
  const firstLabels = firstRow.querySelector('.hour-labels');
  const firstBarContainer = firstRow.querySelector('.timeline-bar-container');
  const firstTimezone = firstBar?.dataset.timezone;
  
  if (!firstBar || !firstLabels || !firstTimezone) return;

  // First timeline never transforms - always at 0
  firstBar.style.transform = 'translateX(0)';
  firstLabels.style.transform = 'translateX(0)';

  // Get first timeline's current time position as percentage of 48-hour bar
  const firstTime = getTimeInTimezone(firstTimezone);
  const firstMinutes = firstTime.getHours() * 60 + firstTime.getMinutes();
  // Position in 48-hour bar (which is 200% width, so visible is 50%)
  const firstPosIn48h = (firstMinutes / MINUTES_48H) * 100;
  // Convert to position in visible container (multiply by 2 since bar is 200% width)
  const syncLinePosition = firstPosIn48h * 2;

  // Process remaining timelines
  rows.forEach((row, index) => {
    const bar = row.querySelector('.timeline-bar');
    const labels = row.querySelector('.hour-labels');
    const barContainer = row.querySelector('.timeline-bar-container');
    
    if (!bar || !labels || !barContainer) return;
    
    const timezone = bar.dataset.timezone;
    if (!timezone) return;

    // Update current time indicator position
    const indicator = bar.querySelector('.current-time-indicator');
    if (indicator) {
      const time = getTimeInTimezone(timezone);
      const currentMinutes = time.getHours() * 60 + time.getMinutes();
      indicator.style.left = `${(currentMinutes / MINUTES_48H) * 100}%`;
    }

    // Skip first timeline (already handled above)
    if (index === 0) return;

    // Set sync line position CSS variable (where the first timeline's current time is)
    barContainer.style.setProperty('--sync-line-position', `${syncLinePosition}%`);

    if (!syncMode) {
      // Unsynced mode: no transform
      bar.style.transform = 'translateX(0)';
      labels.style.transform = 'translateX(0)';
    } else {
      // Synced mode: align this timeline's current time with first timeline's current time position
      const time = getTimeInTimezone(timezone);
      const currentMinutes = time.getHours() * 60 + time.getMinutes();
      const thisPosIn48h = (currentMinutes / MINUTES_48H) * 100;
      
      // Shift needed: move this timeline so its current time aligns with first timeline's position
      const shift = thisPosIn48h - firstPosIn48h;
      const transformValue = `translateX(${-shift}%)`;
      bar.style.transform = transformValue;
      labels.style.transform = transformValue;
    }
  });
}

// Update current time indicators (called periodically by clock update)
function updateCurrentTimeIndicators() {
  const MINUTES_48H = 2880;
  
  document.querySelectorAll('.timeline-row').forEach(row => {
    const bar = row.querySelector('.timeline-bar');
    if (!bar) return;
    
    const timezone = bar.dataset.timezone;
    if (!timezone) return;
    
    const indicator = bar.querySelector('.current-time-indicator');
    if (!indicator) return;

    const time = getTimeInTimezone(timezone);
    const currentMinutes = time.getHours() * 60 + time.getMinutes();

    // Position in 48-hour bar
    const posPercent = (currentMinutes / MINUTES_48H) * 100;
    indicator.style.left = `${posPercent}%`;
  });
}

// Update sync button appearance and container class
function updateSyncButton() {
  const btn = document.getElementById('syncBtn');
  const container = document.querySelector('.app-container');
  if (syncMode) {
    btn.classList.add('active');
    container.classList.remove('unsynced');
  } else {
    btn.classList.remove('active');
    container.classList.add('unsynced');
  }
}

// Update all clocks and indicators
function updateClocks() {
  // Update time displays
  document.querySelectorAll('.timeline-time').forEach(el => {
    const tz = el.dataset.tz;
    const time = getTimeInTimezone(tz);
    el.textContent = formatTime(time);
  });

  // Update date displays
  document.querySelectorAll('.timeline-date').forEach(el => {
    const tz = el.dataset.tzDate;
    const time = getTimeInTimezone(tz);
    el.textContent = formatDate(time);
  });

  // Re-sync timelines (this also updates current time indicators when unsynced)
  syncTimelines();
}

// Start the clock update interval
function startClock() {
  updateClocks();
  setInterval(updateClocks, 1000);
}

// Render settings panel
function renderSettings() {
  const content = document.getElementById('settingsContent');
  content.innerHTML = '';

  config.timelines.forEach(timeline => {
    const card = createTimelineSettingCard(timeline);
    content.appendChild(card);
  });
}

// Populate timezone dropdown
function populateTimezoneDropdown(selectEl, selectedValue, filterOffset = null) {
  const timezones = getTimezonesByOffset(filterOffset);
  selectEl.innerHTML = '';

  timezones.forEach(tz => {
    const offset = getCurrentOffset(tz.value);
    const offsetStr = formatOffset(offset);
    const option = document.createElement('option');
    option.value = tz.value;
    option.textContent = `${tz.label} (${offsetStr})`;
    option.selected = tz.value === selectedValue;
    selectEl.appendChild(option);
  });
}

// Create a timeline setting card
function createTimelineSettingCard(timeline) {
  const card = document.createElement('div');
  card.className = 'timeline-setting';
  card.dataset.id = timeline.id;

  const currentOffset = getCurrentOffset(timeline.timezone);

  card.innerHTML = `
    <div class="timeline-setting-header">
      <input type="text" class="name-input" value="${timeline.name}" placeholder="Name">
      <button class="delete-timeline-btn" data-id="${timeline.id}">Delete</button>
    </div>
    <div class="setting-row timezone-row">
      <span class="setting-label">GMT Offset</span>
      <input type="number" class="gmt-offset-input" value="${currentOffset}" step="0.5" min="-12" max="14" placeholder="e.g. 10">
      <button class="filter-btn" title="Filter by this offset">Filter</button>
      <button class="clear-filter-btn" title="Show all timezones">All</button>
    </div>
    <div class="setting-row">
      <span class="setting-label">Timezone</span>
      <select class="timezone-select"></select>
    </div>
    <div class="time-inputs">
      <div class="time-input-group">
        <label>Wake Time</label>
        <input type="time" class="wake-input" value="${timeline.wakeTime}">
      </div>
      <div class="time-input-group">
        <label>Sleep Time</label>
        <input type="time" class="sleep-input" value="${timeline.sleepTime}">
      </div>
      <div class="time-input-group">
        <label>Work Start</label>
        <input type="time" class="work-start-input" value="${timeline.workStart}">
      </div>
      <div class="time-input-group">
        <label>Work End</label>
        <input type="time" class="work-end-input" value="${timeline.workEnd}">
      </div>
    </div>
  `;

  const selectEl = card.querySelector('.timezone-select');
  const gmtInput = card.querySelector('.gmt-offset-input');
  const filterBtn = card.querySelector('.filter-btn');
  const clearFilterBtn = card.querySelector('.clear-filter-btn');

  // Initial population
  populateTimezoneDropdown(selectEl, timeline.timezone);

  // Filter button - filter by GMT offset
  filterBtn.addEventListener('click', () => {
    const offset = gmtInput.value;
    populateTimezoneDropdown(selectEl, timeline.timezone, offset);
  });

  // Clear filter button - show all
  clearFilterBtn.addEventListener('click', () => {
    gmtInput.value = '';
    populateTimezoneDropdown(selectEl, timeline.timezone);
  });

  // Update GMT offset display when timezone changes
  selectEl.addEventListener('change', () => {
    const newOffset = getCurrentOffset(selectEl.value);
    gmtInput.value = newOffset;
    saveTimelineSettings(card, timeline.id);
  });

  // Add event listeners for other changes
  const inputs = card.querySelectorAll('.name-input, .wake-input, .sleep-input, .work-start-input, .work-end-input');
  inputs.forEach(input => {
    input.addEventListener('change', () => saveTimelineSettings(card, timeline.id));
  });

  // Delete button
  card.querySelector('.delete-timeline-btn').addEventListener('click', () => {
    deleteTimeline(timeline.id);
  });

  return card;
}

// Save timeline settings from a card
async function saveTimelineSettings(card, id) {
  const timeline = config.timelines.find(t => t.id === id);
  if (!timeline) return;

  timeline.name = card.querySelector('.name-input').value;
  timeline.timezone = card.querySelector('.timezone-select').value;
  timeline.wakeTime = card.querySelector('.wake-input').value;
  timeline.sleepTime = card.querySelector('.sleep-input').value;
  timeline.workStart = card.querySelector('.work-start-input').value;
  timeline.workEnd = card.querySelector('.work-end-input').value;

  await window.electronAPI.saveConfig(config);
  renderTimelines();
  syncTimelines();
}

// Delete a timeline
async function deleteTimeline(id) {
  if (config.timelines.length <= 1) {
    alert('You must have at least one timeline.');
    return;
  }

  config.timelines = config.timelines.filter(t => t.id !== id);
  await window.electronAPI.saveConfig(config);
  renderTimelines();
  renderSettings();
}

// Add a new timeline
async function addTimeline() {
  const newId = Date.now().toString();
  config.timelines.push({
    id: newId,
    name: 'New Person',
    timezone: 'America/New_York',
    wakeTime: '07:00',
    sleepTime: '23:00',
    workStart: '09:00',
    workEnd: '17:00'
  });

  await window.electronAPI.saveConfig(config);
  renderTimelines();
  renderSettings();
}

// Setup event listeners
function setupEventListeners() {
  // Close button
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.electronAPI.closeApp();
  });

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.add('open');
  });

  // Close settings button
  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.remove('open');
  });

  // Add timeline button
  document.getElementById('addTimelineBtn').addEventListener('click', addTimeline);

  // Sync button - toggle sync mode
  document.getElementById('syncBtn').addEventListener('click', async () => {
    syncMode = !syncMode;
    config.syncMode = syncMode;
    await window.electronAPI.saveConfig(config);
    updateSyncButton();
    syncTimelines();
  });

  // Time format toggle button
  document.getElementById('timeFormatBtn').addEventListener('click', async () => {
    use24Hour = !use24Hour;
    config.use24Hour = use24Hour;
    await window.electronAPI.saveConfig(config);
    updateTimeFormatButton();
    renderTimelines();
    syncTimelines();
  });

  // Compact mode toggle button
  document.getElementById('compactBtn').addEventListener('click', async () => {
    compactMode = !compactMode;
    config.compactMode = compactMode;
    await window.electronAPI.saveConfig(config);
    updateCompactMode();
  });
}

// Update time format button text
function updateTimeFormatButton() {
  const btn = document.getElementById('timeFormatBtn');
  btn.textContent = use24Hour ? '24h' : '12h';
}

// Update compact mode
function updateCompactMode() {
  const container = document.querySelector('.app-container');
  const btn = document.getElementById('compactBtn');
  if (compactMode) {
    container.classList.add('compact');
    btn.classList.add('active');
  } else {
    container.classList.remove('compact');
    btn.classList.remove('active');
  }
}

// ============================================================================
// THEME SYSTEM
// ============================================================================

// Theme color definitions
const THEME_COLORS = {
  bgPrimary: { label: 'Primary Background', variable: '--bg-primary' },
  bgSecondary: { label: 'Secondary Background', variable: '--bg-secondary' },
  bgTertiary: { label: 'Tertiary Background', variable: '--bg-tertiary' },
  bgInput: { label: 'Input Background', variable: '--bg-input' },
  bgInputReadonly: { label: 'Readonly Input', variable: '--bg-input-readonly' },
  borderPrimary: { label: 'Border Color', variable: '--border-primary' },
  borderFocus: { label: 'Focus Border', variable: '--border-focus' },
  textPrimary: { label: 'Primary Text', variable: '--text-primary' },
  textSecondary: { label: 'Secondary Text', variable: '--text-secondary' },
  textMuted: { label: 'Muted Text', variable: '--text-muted' },
  textDim: { label: 'Dim Text', variable: '--text-dim' },
  textDimmer: { label: 'Dimmer Text', variable: '--text-dimmer' },
  accentSync: { label: 'Sync Line', variable: '--accent-sync' },
  accentWork: { label: 'Work Block', variable: '--accent-work' },
  accentAwake: { label: 'Awake Block', variable: '--accent-awake' },
  accentSleep: { label: 'Sleep Block', variable: '--accent-sleep' },
  accentConverter: { label: 'Converter Accent', variable: '--accent-converter' },
  accentCompact: { label: 'Compact Accent', variable: '--accent-compact' },
  accentSuccess: { label: 'Success Color', variable: '--accent-success' },
  accentDanger: { label: 'Danger Color', variable: '--accent-danger' },
  accentHighlight: { label: 'Highlight Color', variable: '--accent-highlight' },
  titlebarBg: { label: 'Title Bar', variable: '--titlebar-bg' },
  titlebarText: { label: 'Title Text', variable: '--titlebar-text' },
  timelineIndicator: { label: 'Time Indicator', variable: '--timeline-indicator' },
  timelineBarBg: { label: 'Timeline Bar', variable: '--timeline-bar-bg' },
  btnBg: { label: 'Button Background', variable: '--btn-bg' },
  btnHover: { label: 'Button Hover', variable: '--btn-hover' },
  btnText: { label: 'Button Text', variable: '--btn-text' },
  btnTextHover: { label: 'Button Text Hover', variable: '--btn-text-hover' }
};

// Color sections for organization
const COLOR_SECTIONS = [
  { title: 'Backgrounds', keys: ['bgPrimary', 'bgSecondary', 'bgTertiary', 'bgInput', 'bgInputReadonly'] },
  { title: 'Borders', keys: ['borderPrimary', 'borderFocus'] },
  { title: 'Text', keys: ['textPrimary', 'textSecondary', 'textMuted', 'textDim', 'textDimmer'] },
  { title: 'Timeline', keys: ['accentWork', 'accentAwake', 'accentSleep', 'timelineIndicator', 'timelineBarBg'] },
  { title: 'Accents', keys: ['accentSync', 'accentConverter', 'accentCompact', 'accentSuccess', 'accentDanger', 'accentHighlight'] },
  { title: 'UI Elements', keys: ['titlebarBg', 'titlebarText', 'btnBg', 'btnHover', 'btnText', 'btnTextHover'] }
];

// Preset themes
const PRESET_THEMES = {
  default: {
    bgPrimary: '#121212', bgSecondary: '#0a0a0a', bgTertiary: '#1e1e1e',
    bgInput: '#121212', bgInputReadonly: '#0a0a0a',
    borderPrimary: '#2a2a2a', borderFocus: '#ff8c42',
    textPrimary: '#ffffff', textSecondary: '#e0e0e0', textMuted: '#888888', textDim: '#666666', textDimmer: '#444444',
    accentSync: '#ff8c42', accentWork: '#ff6b35', accentAwake: '#2a2a2a', accentSleep: '#0a0a0a',
    accentConverter: '#ff8c42', accentCompact: '#ff6b35', accentSuccess: '#4a4a4a', accentDanger: '#ff5252', accentHighlight: '#ffab70',
    titlebarBg: '#0a0a0a', titlebarText: '#888888',
    timelineIndicator: '#ff8c42', timelineBarBg: '#1e1e1e',
    btnBg: '#1e1e1e', btnHover: '#2a2a2a', btnText: '#666666', btnTextHover: '#ffffff'
  },
  night: {
    bgPrimary: '#1a1a2e', bgSecondary: '#12121e', bgTertiary: '#24243a',
    bgInput: '#1a1a2e', bgInputReadonly: '#12121e',
    borderPrimary: '#2d2d3a', borderFocus: '#4a9eff',
    textPrimary: '#f0f0f5', textSecondary: '#d0d0e0', textMuted: '#8888a0', textDim: '#6666888', textDimmer: '#4a4a60',
    accentSync: '#4a9eff', accentWork: '#5a7aff', accentAwake: '#2d2d3a', accentSleep: '#12121e',
    accentConverter: '#4a9eff', accentCompact: '#7a6aff', accentSuccess: '#3a8a6a', accentDanger: '#ff5a7a', accentHighlight: '#7ab8ff',
    titlebarBg: '#12121e', titlebarText: '#8888a0',
    timelineIndicator: '#4a9eff', timelineBarBg: '#24243a',
    btnBg: '#24243a', btnHover: '#34344a', btnText: '#6666888', btnTextHover: '#f0f0f5'
  },
  day: {
    bgPrimary: '#f5f5f5', bgSecondary: '#ffffff', bgTertiary: '#e8e8e8',
    bgInput: '#ffffff', bgInputReadonly: '#f0f0f0',
    borderPrimary: '#d0d0d0', borderFocus: '#4a90d9',
    textPrimary: '#1a1a1a', textSecondary: '#333333', textMuted: '#666666', textDim: '#888888', textDimmer: '#aaaaaa',
    accentSync: '#4a90d9', accentWork: '#5a9fd9', accentAwake: '#e0e8f0', accentSleep: '#d0d8e0',
    accentConverter: '#4a90d9', accentCompact: '#d97a4a', accentSuccess: '#5ab05a', accentDanger: '#d95a5a', accentHighlight: '#7ab8f5',
    titlebarBg: '#e8e8e8', titlebarText: '#666666',
    timelineIndicator: '#4a90d9', timelineBarBg: '#e0e0e0',
    btnBg: '#e0e0e0', btnHover: '#d0d0d0', btnText: '#888888', btnTextHover: '#1a1a1a'
  },
  volcano: {
    bgPrimary: '#1a0a0a', bgSecondary: '#120808', bgTertiary: '#2a1410',
    bgInput: '#1a0a0a', bgInputReadonly: '#120808',
    borderPrimary: '#3a1a14', borderFocus: '#ff6b35',
    textPrimary: '#fff0e8', textSecondary: '#ffd8c8', textMuted: '#c09080', textDim: '#906050', textDimmer: '#704030',
    accentSync: '#ff4500', accentWork: '#ff6b35', accentAwake: '#3a1a10', accentSleep: '#1a0808',
    accentConverter: '#ff8c42', accentCompact: '#ff4500', accentSuccess: '#8a5a30', accentDanger: '#ff2200', accentHighlight: '#ffab70',
    titlebarBg: '#120808', titlebarText: '#c09080',
    timelineIndicator: '#ff4500', timelineBarBg: '#2a1410',
    btnBg: '#2a1410', btnHover: '#3a2420', btnText: '#906050', btnTextHover: '#fff0e8'
  },
  astral: {
    bgPrimary: '#0f0a1a', bgSecondary: '#0a0610', bgTertiary: '#1a1428',
    bgInput: '#0f0a1a', bgInputReadonly: '#0a0610',
    borderPrimary: '#2a2438', borderFocus: '#ff6af7',
    textPrimary: '#f5f0ff', textSecondary: '#e0d8f0', textMuted: '#9888b0', textDim: '#7060a0', textDimmer: '#503a80',
    accentSync: '#ff6af7', accentWork: '#d055f7', accentAwake: '#2a2438', accentSleep: '#0a0610',
    accentConverter: '#ff6af7', accentCompact: '#aa55f7', accentSuccess: '#4a7a9a', accentDanger: '#ff4a7a', accentHighlight: '#ffaaff',
    titlebarBg: '#0a0610', titlebarText: '#9888b0',
    timelineIndicator: '#ff6af7', timelineBarBg: '#1a1428',
    btnBg: '#1a1428', btnHover: '#2a243a', btnText: '#7060a0', btnTextHover: '#f5f0ff'
  }
};

// Theme state
let currentTheme = {};
let savedTheme = {};
let activePreset = 'default';
let hasUnsavedChanges = false;

// Initialize theme system
function initThemeSystem() {
  // Load saved theme from config - use deep copies
  if (config.theme) {
    currentTheme = JSON.parse(JSON.stringify(config.theme));
    savedTheme = JSON.parse(JSON.stringify(config.theme));
    activePreset = config.activePreset || 'default';
  } else {
    currentTheme = JSON.parse(JSON.stringify(PRESET_THEMES.default));
    savedTheme = JSON.parse(JSON.stringify(PRESET_THEMES.default));
    activePreset = 'default';
  }
  
  // Load custom themes
  if (config.customThemes) {
    PRESET_THEMES.custom1 = config.customThemes.custom1 || JSON.parse(JSON.stringify(PRESET_THEMES.default));
    PRESET_THEMES.custom2 = config.customThemes.custom2 || JSON.parse(JSON.stringify(PRESET_THEMES.default));
    PRESET_THEMES.custom3 = config.customThemes.custom3 || JSON.parse(JSON.stringify(PRESET_THEMES.default));
  }
  
  applyTheme(currentTheme);
  renderThemeEditor();
  setupThemeEventListeners();
}

// Apply theme to CSS variables
function applyTheme(theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    const colorDef = THEME_COLORS[key];
    if (colorDef) {
      root.style.setProperty(colorDef.variable, value);
    }
  }
}

// Render theme editor UI
function renderThemeEditor() {
  const container = document.getElementById('colorSections');
  container.innerHTML = '';
  
  COLOR_SECTIONS.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'color-section';
    sectionEl.innerHTML = `<div class="color-section-title">${section.title}</div>`;
    
    section.keys.forEach(key => {
      const colorDef = THEME_COLORS[key];
      if (!colorDef) return;
      
      const row = document.createElement('div');
      row.className = 'color-row';
      row.innerHTML = `
        <span class="color-label">${colorDef.label}</span>
        <div class="color-input-wrapper">
          <input type="color" class="color-picker" data-key="${key}" value="${currentTheme[key] || '#000000'}">
          <input type="text" class="color-hex-input" data-key="${key}" value="${currentTheme[key] || '#000000'}" maxlength="7">
        </div>
      `;
      sectionEl.appendChild(row);
    });
    
    container.appendChild(sectionEl);
  });
  
  // Update preset buttons
  updatePresetButtons();
}

// Update preset button states
function updatePresetButtons() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === activePreset);
  });
}

// Check for unsaved changes
function checkUnsavedChanges() {
  hasUnsavedChanges = JSON.stringify(currentTheme) !== JSON.stringify(savedTheme);
  const saveBtn = document.getElementById('saveThemeBtn');
  saveBtn.classList.toggle('has-changes', hasUnsavedChanges);
}

// Setup theme event listeners
function setupThemeEventListeners() {
  // Theme button
  document.getElementById('themeBtn').addEventListener('click', () => {
    document.getElementById('themePanel').classList.add('open');
  });
  
  // Close theme button
  document.getElementById('closeThemeBtn').addEventListener('click', () => {
    if (hasUnsavedChanges) {
      showConfirmPopup();
    } else {
      document.getElementById('themePanel').classList.remove('open');
    }
  });
  
  // Save theme button
  document.getElementById('saveThemeBtn').addEventListener('click', saveTheme);
  
  // Preset buttons
  document.getElementById('presetSelector').addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-btn');
    if (!btn) return;
    
    const preset = btn.dataset.preset;
    if (preset.startsWith('custom') && !PRESET_THEMES[preset]) {
      PRESET_THEMES[preset] = JSON.parse(JSON.stringify(currentTheme));
    }
    
    if (PRESET_THEMES[preset]) {
      currentTheme = JSON.parse(JSON.stringify(PRESET_THEMES[preset]));
      activePreset = preset;
      applyTheme(currentTheme);
      renderThemeEditor();
      updatePresetButtons();
      checkUnsavedChanges();
    }
  });
  
  // Color picker changes
  document.getElementById('colorSections').addEventListener('input', (e) => {
    if (e.target.classList.contains('color-picker')) {
      const key = e.target.dataset.key;
      const value = e.target.value;
      currentTheme[key] = value;
      
      // Update hex input
      const hexInput = e.target.parentElement.querySelector('.color-hex-input');
      if (hexInput) hexInput.value = value;
      
      applyTheme(currentTheme);
      activePreset = findMatchingPreset() || activePreset;
      updatePresetButtons();
      checkUnsavedChanges();
    }
    
    if (e.target.classList.contains('color-hex-input')) {
      const key = e.target.dataset.key;
      let value = e.target.value;
      
      // Validate hex color
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        currentTheme[key] = value;
        
        // Update color picker
        const colorPicker = e.target.parentElement.querySelector('.color-picker');
        if (colorPicker) colorPicker.value = value;
        
        applyTheme(currentTheme);
        activePreset = findMatchingPreset() || activePreset;
        updatePresetButtons();
        checkUnsavedChanges();
      }
    }
  });
  
  // Confirmation popup buttons
  document.getElementById('confirmCancel').addEventListener('click', hideConfirmPopup);
  
  document.getElementById('confirmDiscard').addEventListener('click', () => {
    currentTheme = { ...savedTheme };
    applyTheme(currentTheme);
    renderThemeEditor();
    hasUnsavedChanges = false;
    hideConfirmPopup();
    document.getElementById('themePanel').classList.remove('open');
  });
  
  document.getElementById('confirmSave').addEventListener('click', async () => {
    await saveTheme();
    hideConfirmPopup();
    document.getElementById('themePanel').classList.remove('open');
  });
}

// Find matching preset for current theme
function findMatchingPreset() {
  for (const [name, preset] of Object.entries(PRESET_THEMES)) {
    if (JSON.stringify(currentTheme) === JSON.stringify(preset)) {
      return name;
    }
  }
  return null;
}

// Save theme to config
async function saveTheme() {
  // Deep copy to ensure objects are separate
  savedTheme = JSON.parse(JSON.stringify(currentTheme));
  config.theme = JSON.parse(JSON.stringify(currentTheme));
  config.activePreset = activePreset;
  
  // Save custom themes if current preset is custom
  if (activePreset.startsWith('custom')) {
    if (!config.customThemes) config.customThemes = {};
    config.customThemes[activePreset] = JSON.parse(JSON.stringify(currentTheme));
  }
  
  await window.electronAPI.saveConfig(config);
  hasUnsavedChanges = false;
  document.getElementById('saveThemeBtn').classList.remove('has-changes');
  checkUnsavedChanges();
}

// Show confirmation popup
function showConfirmPopup() {
  document.getElementById('confirmPopupOverlay').classList.add('visible');
}

// Hide confirmation popup
function hideConfirmPopup() {
  document.getElementById('confirmPopupOverlay').classList.remove('visible');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
