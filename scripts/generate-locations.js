/**
 * Generates data/locations.yaml with every country, its currency,
 * states/regions, and timezone(s) per state (from state coordinates).
 *
 * Run: node scripts/generate-locations.js
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { Country, State } = require('country-state-city');
const ct = require('countries-and-timezones');
const { find } = require('geo-tz');

const OUT = path.join(__dirname, '..', 'data', 'locations.yaml');

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function countryTimezones(isoCode) {
  try {
    const zones = ct.getTimezonesForCountry(isoCode) || [];
    return unique(zones.map((z) => z.name)).sort((a, b) => a.localeCompare(b));
  } catch (_) {
    return [];
  }
}

function stateTimezones(lat, lng, fallbackZones) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return fallbackZones.slice(0, 1);
  }

  try {
    const zones = find(latitude, longitude) || [];
    if (zones.length) return unique(zones).sort((a, b) => a.localeCompare(b));
  } catch (_) {
    // fall through
  }

  return fallbackZones.slice(0, 1);
}

function main() {
  const countries = Country.getAllCountries()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const payload = {
    generatedAt: new Date().toISOString(),
    source: [
      'country-state-city',
      'countries-and-timezones',
      'geo-tz'
    ],
    countries: {}
  };

  let stateCount = 0;

  for (const country of countries) {
    const zones = countryTimezones(country.isoCode);
    const states = State.getStatesOfCountry(country.isoCode) || [];
    const stateMap = {};

    for (const state of states
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))) {
      stateCount += 1;
      stateMap[state.name] = {
        isoCode: state.isoCode || null,
        timezones: stateTimezones(state.latitude, state.longitude, zones)
      };
    }

    // Countries with no administrative states still keep country-level zones.
    payload.countries[country.name] = {
      iso2: country.isoCode,
      iso3: country.iso3Code || null,
      phonecode: country.phonecode || null,
      currency: country.currency || null,
      currencyName: country.currencyName || null,
      currencySymbol: country.currencySymbol || null,
      timezones: zones,
      states: stateMap
    };

    process.stdout.write(`\r${country.name.padEnd(40)} states=${String(states.length).padStart(4)}`);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const yamlText = yaml.dump(payload, {
    lineWidth: 140,
    noRefs: true,
    sortKeys: false
  });
  fs.writeFileSync(OUT, yamlText, 'utf8');

  console.log(`\nWrote ${OUT}`);
  console.log(`Countries: ${countries.length}`);
  console.log(`States/regions: ${stateCount}`);
  console.log(`Size: ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`);
}

main();
