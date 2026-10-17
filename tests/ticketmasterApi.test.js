import assert from 'node:assert/strict';
import test from 'node:test';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};

const { fetchEventsApi } = await import('../src/services/ticketmasterApi.js');

test('uses filtered sample events when no API key is configured', async () => {
  storage.clear();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error('Fetch should not be called without an API key');
  };

  try {
    const result = await fetchEventsApi({ keyword: 'Coldplay', city: 'New York' });

    assert.equal(result.isLiveApi, false);
    assert.equal(result.events.length, 1);
    assert.match(result.events[0].name, /Coldplay/);
    assert.equal(result.page.totalElements, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('falls back to sample events when the Ticketmaster API returns an error', async () => {
  storage.set('eventsphere_tm_api_key', 'test-api-key');
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  console.warn = () => {};

  try {
    const result = await fetchEventsApi({ keyword: 'Coldplay' });

    assert.equal(result.isLiveApi, false);
    assert.equal(result.events.length, 1);
    assert.match(result.events[0].name, /Coldplay/);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    storage.clear();
  }
});
