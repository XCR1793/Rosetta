const CACHE_TTL_MS = 5 * 60 * 1000;

/** @type {Map<string, { rate: number, fetchedAt: number, from: string, to: string, date?: string, source?: string }>} */
const cache = new Map();

function pairKey(from, to) {
  return `${String(from || '').toUpperCase()}_${String(to || '').toUpperCase()}`;
}

function sameCurrencyResult(source, target) {
  return {
    rate: 1,
    from: source,
    to: target,
    fetchedAt: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    source: 'identity'
  };
}

async function fetchFrankfurterRate(from, to) {
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Frankfurter ${response.status}`);
  }

  const data = await response.json();
  const rate = Number(data?.rates?.[to]);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`No Frankfurter rate for ${from} → ${to}`);
  }

  return {
    rate,
    from,
    to,
    fetchedAt: Date.now(),
    date: data.date || null,
    source: 'frankfurter'
  };
}

async function fetchOpenErRate(from, to) {
  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenER ${response.status}`);
  }

  const data = await response.json();
  if (data?.result !== 'success') {
    throw new Error(data?.['error-type'] || 'OpenER failed');
  }

  const rate = Number(data?.rates?.[to]);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`No OpenER rate for ${from} → ${to}`);
  }

  return {
    rate,
    from,
    to,
    fetchedAt: Date.now(),
    date: data.time_last_update_utc || null,
    source: 'open.er-api'
  };
}

async function fetchLiveRate(from, to) {
  const errors = [];
  for (const fetcher of [fetchFrankfurterRate, fetchOpenErRate]) {
    try {
      return await fetcher(from, to);
    } catch (error) {
      errors.push(error.message);
    }
  }
  throw new Error(errors.join(' · ') || 'Exchange fetch failed');
}

async function getExchangeRate(from, to, { force = false } = {}) {
  const source = String(from || '').toUpperCase();
  const target = String(to || '').toUpperCase();

  if (!source || !target) {
    throw new Error('Missing currency code');
  }

  if (source === target) {
    return { ...sameCurrencyResult(source, target), cached: false };
  }

  const key = pairKey(source, target);
  const cached = cache.get(key);
  if (!force && cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { ...cached, cached: true };
  }

  try {
    const fresh = await fetchLiveRate(source, target);
    cache.set(key, fresh);
    cache.set(pairKey(target, source), {
      rate: 1 / fresh.rate,
      from: target,
      to: source,
      fetchedAt: fresh.fetchedAt,
      date: fresh.date,
      source: fresh.source
    });
    return { ...fresh, cached: false };
  } catch (error) {
    if (cached) {
      return { ...cached, cached: true, stale: true, error: error.message };
    }
    throw error;
  }
}

module.exports = {
  getExchangeRate,
  CACHE_TTL_MS
};
