import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
  missionDetails: [],
  loading: false,
  error: null,
  hasFetched: false,
};


// Async thunk to fetch mission details by ID
export const fetchMissionDetails = createAsyncThunk(
  'missionDetails/fetchMissionReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hod/get-missions-reports');
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const missionDetailsSlice = createSlice({
  name: 'missionReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.missionDetails = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchMissionDetails.rejected, (state, action) => {
        state.loading = false;
      });
      
  },
});

export default missionDetailsSlice.reducer;
