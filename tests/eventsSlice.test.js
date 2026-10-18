import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const { default: eventsReducer, fetchEvents } = await import('../src/redux/slices/eventsSlice.js');

test('ignores stale event responses when a newer request has started', () => {
  let state = eventsReducer(undefined, { type: '@@test/init' });
  const oldRequest = fetchEvents.pending('old-request');
  const currentRequest = fetchEvents.pending('current-request');

  state = eventsReducer(state, oldRequest);
  state = eventsReducer(state, currentRequest);
  state = eventsReducer(
    state,
    fetchEvents.fulfilled(
      { events: [{ id: 'stale-event' }], isLiveApi: true, page: { totalElements: 1, totalPages: 1 } },
      'old-request'
    )
  );

  assert.deepEqual(state.items, []);
  assert.equal(state.loading, true);
  assert.equal(state.currentRequestId, 'current-request');

  state = eventsReducer(
    state,
    fetchEvents.fulfilled(
      { events: [{ id: 'current-event' }], isLiveApi: false, page: { totalElements: 1, totalPages: 1 } },
      'current-request'
    )
  );

  assert.deepEqual(state.items, [{ id: 'current-event' }]);
  assert.equal(state.loading, false);
  assert.equal(state.currentRequestId, null);
});

test('ignores stale errors after a newer event request has started', () => {
  let state = eventsReducer(undefined, { type: '@@test/init' });
  state = eventsReducer(state, fetchEvents.pending('old-request'));
  state = eventsReducer(state, fetchEvents.pending('current-request'));
  state = eventsReducer(
    state,
    fetchEvents.rejected(new Error('Stale request failed'), 'old-request', undefined, 'Stale request failed')
  );

  assert.equal(state.error, null);
  assert.equal(state.loading, true);
  assert.equal(state.currentRequestId, 'current-request');
});
