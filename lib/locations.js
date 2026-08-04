const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let cached = null;
let aliasIndex = null;

/** Common alternate country names → canonical keys in locations.yaml */
const COUNTRY_ALIASES = {
  'Korea, Republic of': 'South Korea',
  'Republic of Korea': 'South Korea',
  'Korea (Republic of)': 'South Korea',
  'South Korea (Republic of Korea)': 'South Korea',
  ROK: 'South Korea',
  'Korea, Democratic People\'s Republic of': 'North Korea',
  'Democratic People\'s Republic of Korea': 'North Korea',
  DPRK: 'North Korea',
  'United States of America': 'United States',
  USA: 'United States',
  US: 'United States',
  'U.S.': 'United States',
  'U.S.A.': 'United States',
  'Russian Federation': 'Russia',
  'Viet Nam': 'Vietnam',
  'Czechia': 'Czech Republic',
  'Macedonia, the Former Yugoslav Republic of': 'Macedonia',
  'North Macedonia': 'Macedonia',
  'Tanzania, United Republic of': 'Tanzania',
  'Iran, Islamic Republic of': 'Iran',
  'Syrian Arab Republic': 'Syria',
  'Venezuela, Bolivarian Republic of': 'Venezuela',
  'Bolivia, Plurinational State of': 'Bolivia',
  'Moldova, Republic of': 'Moldova',
  'Palestine, State of': 'Palestinian Territory Occupied',
  'Taiwan, Province of China': 'Taiwan',
  'Hong Kong': 'Hong Kong S.A.R.',
  Macao: 'Macau S.A.R.',
  Macau: 'Macau S.A.R.',
  'Brunei Darussalam': 'Brunei',
  'Lao People\'s Democratic Republic': 'Laos',
  "Côte d'Ivoire": "Cote D'Ivoire (Ivory Coast)",
  'Ivory Coast': "Cote D'Ivoire (Ivory Coast)",
  'Cape Verde': 'Cape Verde',
  CaboVerde: 'Cape Verde',
  'Cabo Verde': 'Cape Verde',
  UK: 'United Kingdom',
  'Great Britain': 'United Kingdom',
  Britain: 'United Kingdom',
  UAE: 'United Arab Emirates',
  'Swaziland': 'Swaziland',
  Eswatini: 'Swaziland',
  Burma: 'Myanmar',
  'East Timor': 'East Timor',
  TimorLeste: 'East Timor',
  'Timor-Leste': 'East Timor'
};

function loadLocations() {
  if (cached) return cached;

  const filePath = path.join(__dirname, '..', 'data', 'locations.yaml');
  const parsed = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
  cached = parsed.countries || {};
  return cached;
}

function buildAliasIndex() {
  if (aliasIndex) return aliasIndex;

  const countries = loadLocations();
  aliasIndex = new Map();

  for (const name of Object.keys(countries)) {
    aliasIndex.set(name.toLowerCase(), name);
  }

  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    if (countries[canonical]) {
      aliasIndex.set(alias.toLowerCase(), canonical);
    }
  }

  // Also index by ISO2 / ISO3 codes.
  for (const [name, entry] of Object.entries(countries)) {
    if (entry.iso2) aliasIndex.set(String(entry.iso2).toLowerCase(), name);
    if (entry.iso3) aliasIndex.set(String(entry.iso3).toLowerCase(), name);
  }

  return aliasIndex;
}

function resolveCountryName(country) {
  if (!country) return null;
  const countries = loadLocations();
  if (countries[country]) return country;

  const mapped = buildAliasIndex().get(String(country).trim().toLowerCase());
  return mapped || null;
}

function listCountries() {
  return Object.keys(loadLocations()).sort((a, b) => a.localeCompare(b));
}

function getCountry(country) {
  const canonical = resolveCountryName(country);
  return canonical ? loadLocations()[canonical] : null;
}

function listStates(country) {
  const entry = getCountry(country);
  if (!entry || !entry.states) return [];
  return Object.keys(entry.states).sort((a, b) => a.localeCompare(b));
}

function getCurrencyForCountry(country) {
  const entry = getCountry(country);
  return entry?.currency || null;
}

function getTimezonesForLocation(country, state) {
  const entry = getCountry(country);
  if (!entry) return listAllTimezones().slice(0, 1);

  if (state && entry.states && entry.states[state]) {
    const stateZones = entry.states[state].timezones || [];
    if (stateZones.length) return [...stateZones];
  }

  if (Array.isArray(entry.timezones) && entry.timezones.length) {
    return [...entry.timezones];
  }

  return ['UTC'];
}

function listAllTimezones() {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch (_) {
    // fall through
  }

  const zones = new Set(['UTC']);
  for (const country of Object.values(loadLocations())) {
    for (const zone of country.timezones || []) zones.add(zone);
    for (const state of Object.values(country.states || {})) {
      for (const zone of state.timezones || []) zones.add(zone);
    }
  }
  return [...zones].sort((a, b) => a.localeCompare(b));
}

function listGmtOffsets() {
  const offsets = [];
  for (let h = -12; h <= 14; h += 1) {
    const sign = h >= 0 ? '+' : '-';
    const abs = Math.abs(h).toString().padStart(2, '0');
    offsets.push({
      label: `GMT${sign}${abs}:00`,
      value: h
    });
  }
  return offsets;
}

function resolvePersonTimezone(person) {
  if (!person) return 'UTC';

  if (person.timezoneMode === 'gmt' && Number.isFinite(Number(person.gmtOffset))) {
    const offset = Number(person.gmtOffset);
    // Etc/GMT has inverted signs: Etc/GMT-10 == UTC+10
    const inverted = -offset;
    const sign = inverted >= 0 ? '+' : '-';
    return `Etc/GMT${sign}${Math.abs(inverted)}`;
  }

  if (person.timezone && typeof person.timezone === 'string') {
    return person.timezone;
  }

  const suggested = getTimezonesForLocation(person.country, person.state);
  return suggested[0] || 'UTC';
}

function resolvePersonCurrency(person) {
  if (!person) return null;
  if (person.currencyMode === 'manual' && person.currency) {
    return person.currency;
  }
  return getCurrencyForCountry(person.country) || person.currency || null;
}

module.exports = {
  loadLocations,
  resolveCountryName,
  listCountries,
  listStates,
  getCurrencyForCountry,
  getTimezonesForLocation,
  listAllTimezones,
  listGmtOffsets,
  resolvePersonTimezone,
  resolvePersonCurrency
};
