import { createSlice } from '@reduxjs/toolkit';

const USERS_STORAGE_KEY = 'eventsphere_registered_users';
const SESSION_STORAGE_KEY = 'eventsphere_session_user';

// Pre-seeded demo user so testing login is instant
const DEFAULT_USERS = [
  {
    id: 'user-demo-01',
    name: 'Alex Mercer',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    joinedAt: '2026-01-15'
  }
];

const loadStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

const loadSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialSession = loadSessionUser();

const initialState = {
  currentUser: initialSession,
  isAuthenticated: !!initialSession,
  registeredUsers: loadStoredUsers(),
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload;
      const normalizedEmail = email.toLowerCase().trim();

      // Check duplicate
      const existing = state.registeredUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (existing) {
        state.error = 'An account with this email already exists. Please login.';
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=6366f1`,
        joinedAt: new Date().toISOString()
      };

      state.registeredUsers.push(newUser);
      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.error = null;

      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.registeredUsers));
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    },

    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const normalizedEmail = email.toLowerCase().trim();

      const user = state.registeredUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (!user) {
        state.error = 'No account found with this email. Please register.';
        return;
      }

      if (user.password !== password) {
        state.error = 'Invalid password. Please try again.';
        return;
      }

      state.currentUser = user;
      state.isAuthenticated = true;
      state.error = null;

      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save session to localStorage', e);
      }
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;

      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear session', e);
      }
    },

    updateUserProfile: (state, action) => {
      if (!state.currentUser) return;
      const { name, avatar } = action.payload;
      const updated = {
        ...state.currentUser,
        name: name || state.currentUser.name,
        avatar: avatar || state.currentUser.avatar
      };

      state.currentUser = updated;
      state.registeredUsers = state.registeredUsers.map((u) =>
        u.id === updated.id ? updated : u
      );

      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.registeredUsers));
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage profile', e);
      }
    },

    clearAuthError: (state) => {
      state.error = null;
    }
  }
});

export const {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  clearAuthError
} = authSlice.actions;

export default authSlice.reducer;
