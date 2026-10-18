import assert from 'node:assert/strict';
import test from 'node:test';
import registrationsReducer, { registerForEvent } from '../src/redux/slices/registrationsSlice.js';

const registration = {
  userId: 'user-1',
  userEmail: 'alex@example.com',
  userName: 'Alex',
  eventId: 'event-1',
  eventName: 'Sample Event',
  eventDate: '2026-12-01',
  eventTime: '19:00',
  eventVenue: 'Sample Venue',
  eventCity: 'New York'
};

test('prevents a user from registering for the same active event twice', () => {
  const existingRegistration = { eventId: registration.eventId, status: 'confirmed' };
  const state = {
    items: [existingRegistration],
    currentUserId: registration.userId,
    activePassModal: null,
    error: null
  };

  const result = registrationsReducer(state, registerForEvent(registration));

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0], existingRegistration);
  assert.equal(result.activePassModal, null);
  assert.equal(result.error, 'You are already registered for this event!');
});

test('creates and persists a registration with a digital pass', () => {
  const persisted = new Map();
  globalThis.localStorage = {
    setItem: (key, value) => persisted.set(key, String(value))
  };

  const initialState = {
    items: [],
    currentUserId: registration.userId,
    activePassModal: null,
    error: 'A previous registration was rejected.'
  };
  const result = registrationsReducer(initialState, registerForEvent(registration));
  const [createdRegistration] = result.items;

  assert.equal(result.items.length, 1);
  assert.equal(result.error, null);
  assert.match(createdRegistration.confirmationCode, /^ES-\d{6}$/);
  assert.equal(createdRegistration.eventId, registration.eventId);
  assert.equal(result.activePassModal, createdRegistration);
  assert.deepEqual(
    JSON.parse(persisted.get(`eventsphere_registrations_${registration.userId}`)),
    [createdRegistration]
  );
});
