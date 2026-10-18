import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEventsApi,
  fetchEventDetailsApi,
  getActiveApiKey,
  saveCustomApiKey
} from '../../services/ticketmasterApi';

// Async thunk to fetch list of events
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().events;
      const response = await fetchEventsApi({
        keyword: filters.keyword,
        classificationName: filters.category,
        city: filters.city,
        sort: filters.sort,
        page: pagination.page,
        size: pagination.size
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch events from Ticketmaster API');
    }
  }
);

// Async thunk to fetch single event details
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await fetchEventDetailsApi(eventId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch event details');
    }
  }
);

const initialState = {
  items: [],
  currentRequestId: null,
  selectedEvent: null,
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
  isLiveApi: false,
  activeApiKey: getActiveApiKey(),
  filters: {
    keyword: '',
    category: 'All',
    city: 'All',
    sort: 'date,asc'
  },
  pagination: {
    page: 0,
    size: 9,
    totalElements: 0,
    totalPages: 1
  }
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.filters.keyword = action.payload;
      state.pagination.page = 0;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.page = 0;
    },
    setCity: (state, action) => {
      state.filters.city = action.payload;
      state.pagination.page = 0;
    },
    setSort: (state, action) => {
      state.filters.sort = action.payload;
      state.pagination.page = 0;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        keyword: '',
        category: 'All',
        city: 'All',
        sort: 'date,asc'
      };
      state.pagination.page = 0;
    },
    updateApiKey: (state, action) => {
      saveCustomApiKey(action.payload);
      state.activeApiKey = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.currentRequestId = null;
        state.items = action.payload.events || [];
        state.isLiveApi = action.payload.isLiveApi;
        if (action.payload.page) {
          state.pagination.totalElements = action.payload.page.totalElements || action.payload.events.length;
          state.pagination.totalPages = action.payload.page.totalPages || 1;
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.currentRequestId = null;
        state.error = action.payload || 'Could not load events';
      })
      // fetchEventById
      .addCase(fetchEventById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedEvent = action.payload.event;
        state.isLiveApi = action.payload.isLiveApi;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || 'Could not load event details';
      });
  }
});

export const {
  setKeyword,
  setCategory,
  setCity,
  setSort,
  setPage,
  resetFilters,
  updateApiKey,
  clearSelectedEvent
} = eventsSlice.actions;

export default eventsSlice.reducer;
