import { createSlice } from '@reduxjs/toolkit';

const getStorageKey = (userId) => `eventsphere_registrations_${userId || 'guest'}`;

const loadUserRegistrationsFromStorage = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUserRegistrationsToStorage = (userId, items) => {
  if (!userId) return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch (e) {
    console.error('Failed saving registrations to localStorage', e);
  }
};

const initialState = {
  items: [],
  currentUserId: null,
  activePassModal: null, // Holds registration info for digital ticket pass modal view
  error: null
};

export const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    syncUserRegistrations: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      state.items = loadUserRegistrationsFromStorage(userId);
      state.error = null;
    },

    registerForEvent: (state, action) => {
      const {
        userId,
        userEmail,
        userName,
        eventId,
        eventName,
        eventDate,
        eventTime,
        eventVenue,
        eventCity,
        eventImage,
        eventCategory,
        ticketCount = 1,
        ticketTier = 'General Admission',
        specialRequests = ''
      } = action.payload;

      // Duplicate check: has this user already registered for this active event?
      const alreadyRegistered = state.items.some(
        (reg) => reg.eventId === eventId && reg.status !== 'cancelled'
      );

      if (alreadyRegistered) {
        state.error = 'You are already registered for this event!';
        return;
      }

      const confirmationCode = `ES-${Math.floor(100000 + Math.random() * 900000)}`;
      const newRegistration = {
        id: `reg-${Date.now()}`,
        confirmationCode,
        userId,
        userEmail,
        userName,
        eventId,
        eventName,
        eventDate,
        eventTime: eventTime || 'TBD',
        eventVenue: eventVenue || 'Main Arena',
        eventCity: eventCity || 'Worldwide',
        eventImage,
        eventCategory: eventCategory || 'Live Event',
        ticketCount: Number(ticketCount),
        ticketTier,
        specialRequests,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      };

      state.items.unshift(newRegistration);
      state.activePassModal = newRegistration;
      state.error = null;

      saveUserRegistrationsToStorage(userId, state.items);
    },

    cancelEventRegistration: (state, action) => {
      const registrationId = action.payload;
      const index = state.items.findIndex((r) => r.id === registrationId);

      if (index !== -1) {
        // Mark as cancelled or remove based on preference
        state.items[index].status = 'cancelled';
        saveUserRegistrationsToStorage(state.currentUserId, state.items);
      }
    },

    deleteRegistrationRecord: (state, action) => {
      const registrationId = action.payload;
      state.items = state.items.filter((r) => r.id !== registrationId);
      saveUserRegistrationsToStorage(state.currentUserId, state.items);
    },

    setActivePassModal: (state, action) => {
      state.activePassModal = action.payload;
    },

    closePassModal: (state) => {
      state.activePassModal = null;
    },

    clearRegistrationError: (state) => {
      state.error = null;
    }
  }
});

export const {
  syncUserRegistrations,
  registerForEvent,
  cancelEventRegistration,
  deleteRegistrationRecord,
  setActivePassModal,
  closePassModal,
  clearRegistrationError
} = registrationsSlice.actions;

export default registrationsSlice.reducer;
