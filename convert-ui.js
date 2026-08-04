/* Currency convert panel helpers — loaded after schedule.js, used by renderer.js */

window.PerchConvert = (function () {
  const COMMON_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'JPY', 'CNY', 'HKD', 'SGD',
    'KRW', 'INR', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON',
    'TRY', 'BRL', 'MXN', 'ZAR', 'AED', 'THB', 'IDR', 'MYR', 'PHP', 'VND',
    'TWD', 'ILS', 'SAR', 'QAR', 'CLP', 'ARS', 'COP', 'PEN', 'RUB', 'UAH'
  ];

  function personCurrency(person) {
    return String(person?.resolvedCurrency || person?.currency || '').toUpperCase() || null;
  }

  function effectiveCurrency(person, overrides = {}) {
    const override = person?.id ? overrides[person.id] : null;
    if (override) return String(override).toUpperCase();
    return personCurrency(person);
  }

  function findPerson(people, id) {
    return (people || []).find((p) => p.id === id) || null;
  }

  function defaultPair(people) {
    const list = Array.isArray(people) ? people : [];
    const from = list[0] || null;
    const to = list.find((p) => p.id !== from?.id) || from;
    return {
      fromId: from?.id || '',
      toId: to?.id || ''
    };
  }

  function formatRate(rate) {
    const n = Number(rate);
    if (!Number.isFinite(n)) return '—';
    if (n >= 100) return n.toFixed(2);
    if (n >= 1) return n.toFixed(4);
    return n.toFixed(6);
  }

  function formatAmount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const abs = Math.abs(n);
    if (abs >= 1000) return n.toFixed(2);
    if (abs >= 1) return String(Number(n.toFixed(4)));
    return String(Number(n.toFixed(6)));
  }

  function parseAmount(raw) {
    const cleaned = String(raw || '')
      .trim()
      .replace(/,/g, '');
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  function formatUpdatedAt(fetchedAt) {
    if (!fetchedAt) return 'Not updated yet';
    const date = new Date(fetchedAt);
    if (Number.isNaN(date.getTime())) return 'Not updated yet';
    const diffSec = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
    if (diffSec < 10) return 'Updated just now';
    if (diffSec < 60) return `Updated ${diffSec}s ago`;
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `Updated ${diffMin}m ago`;
    return `Updated ${date.toLocaleString()}`;
  }

  function fillCurrencySelect(select, person, overrides = {}) {
    if (!select) return;
    const autoCode = personCurrency(person);
    const override = person?.id ? overrides[person.id] || '' : '';

    const codes = new Set(COMMON_CURRENCIES);
    if (autoCode) codes.add(autoCode);
    if (override) codes.add(String(override).toUpperCase());

    select.innerHTML = '';

    const autoOpt = document.createElement('option');
    autoOpt.value = '';
    autoOpt.textContent = autoCode ? `Auto · ${autoCode}` : 'Auto';
    select.appendChild(autoOpt);

    for (const code of [...codes].sort()) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = code;
      select.appendChild(option);
    }

    select.value = override;
    if (override && select.value !== override) {
      const extra = document.createElement('option');
      extra.value = override;
      extra.textContent = override;
      select.appendChild(extra);
      select.value = override;
    }

    select.classList.toggle('is-manual', Boolean(override));
    select.title = override
      ? `Manual ${override} · choose Auto to restore`
      : autoCode
        ? `Auto ${autoCode} · pick another to override`
        : 'Choose a currency';
  }

  return {
    COMMON_CURRENCIES,
    personCurrency,
    effectiveCurrency,
    findPerson,
    defaultPair,
    formatRate,
    formatAmount,
    parseAmount,
    formatUpdatedAt,
    fillCurrencySelect
  };
})();
