import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to mark a notification as read and fetch updated notifications
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/notifications/mark-as-read`);
      // Fetch the updated notifications after marking as read
      return dispatch(fetchNotifications()).unwrap();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAllAsRead(state) {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload; // Updated notifications list
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

// Export actions
export const { markAllAsRead, clearNotifications, addNotification } = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;
