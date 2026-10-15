import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  isApiKeyModalOpen: false,
  isRegisterModalOpen: false,
  registerModalEvent: null
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { type = 'info', message } = action.payload;
      state.toasts.push({
        id: `toast-${Date.now()}-${Math.random()}`,
        type,
        message
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openApiKeyModal: (state) => {
      state.isApiKeyModalOpen = true;
    },
    closeApiKeyModal: (state) => {
      state.isApiKeyModalOpen = false;
    },
    openRegisterModal: (state, action) => {
      state.registerModalEvent = action.payload;
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
      state.registerModalEvent = null;
    }
  }
});

export const {
  addToast,
  removeToast,
  openApiKeyModal,
  closeApiKeyModal,
  openRegisterModal,
  closeRegisterModal
} = uiSlice.actions;

export default uiSlice.reducer;
