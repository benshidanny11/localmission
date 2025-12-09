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
  'missionDetails/fetchMissionDetailsComputation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hod/get-missions-for-computation');
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const computeMission = createAsyncThunk(
  'missionDetails/computeMission',
  async ({ referenceId, missionData }, { rejectWithValue }) => {
    try {
      console.log(missionData);
      const response = await axiosInstance.patch(`/hod/compute-mission?referenceId=${referenceId}`, missionData);
      console.log(response.data);
      return response.data.data; // Assuming the response structure has message and data fields
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const cancelMissionComputation = createAsyncThunk(
  'missionDetails/cancelMissionComputation',
  async ({ referenceId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/hod/cancel-computed-mission?referenceId=${referenceId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const missionDetailsSlice = createSlice({
  name: 'missionDetailsComputation',
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
      })
      .addCase(computeMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(computeMission.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
        const index = state.missionDetails.findIndex(
          (mission) => mission.referenceId === action.payload.referenceId
        );
        if (index !== -1) {
          state.missionDetails.splice(index, 1);
        }
      })    
      .addCase(computeMission.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelMissionComputation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelMissionComputation.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(cancelMissionComputation.rejected, (state, action) => {
        state.loading = false;
      });
      
  },
});

export default missionDetailsSlice.reducer;
