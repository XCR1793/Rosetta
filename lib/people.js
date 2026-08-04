const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {
  getCurrencyForCountry,
  resolvePersonTimezone,
  resolvePersonCurrency
} = require('./locations');

function createId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function normalizePerson(raw = {}) {
  const country = raw.country || '';
  const currencyMode = raw.currencyMode === 'manual' ? 'manual' : 'auto';
  const timezoneMode = ['location', 'timezone', 'gmt'].includes(raw.timezoneMode)
    ? raw.timezoneMode
    : 'location';

  const person = {
    id: raw.id || createId(),
    name: (raw.name || 'Person').trim() || 'Person',
    country,
    state: raw.state || '',
    timezoneMode,
    timezone: raw.timezone || null,
    gmtOffset: Number.isFinite(Number(raw.gmtOffset)) ? Number(raw.gmtOffset) : null,
    currencyMode,
    currency: raw.currency || null
  };

  if (person.currencyMode === 'auto') {
    person.currency = getCurrencyForCountry(person.country) || person.currency;
  }

  if (person.timezoneMode === 'location' && !person.timezone) {
    person.timezone = resolvePersonTimezone(person);
  }

  return person;
}

function loadPeopleFile(filePath, defaultPath) {
  try {
    if (!fs.existsSync(filePath)) {
      const seed = fs.existsSync(defaultPath)
        ? fs.readFileSync(defaultPath, 'utf8')
        : 'people: []\n';
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, seed, 'utf8');
    }

    const parsed = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
    const people = Array.isArray(parsed.people) ? parsed.people.map(normalizePerson) : [];
    return { people };
  } catch (e) {
    console.error('Error loading people.yaml:', e);
    return { people: [] };
  }
}

function savePeopleFile(filePath, data) {
  const people = Array.isArray(data?.people) ? data.people.map(normalizePerson) : [];
  const yamlText = yaml.dump(
    { people },
    {
      lineWidth: 120,
      noRefs: true,
      sortKeys: false
    }
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, yamlText, 'utf8');
  return { people };
}

function enrichPeople(people) {
  return people.map((person) => ({
    ...person,
    resolvedTimezone: resolvePersonTimezone(person),
    resolvedCurrency: resolvePersonCurrency(person)
  }));
}

module.exports = {
  createId,
  normalizePerson,
  loadPeopleFile,
  savePeopleFile,
  enrichPeople
};
