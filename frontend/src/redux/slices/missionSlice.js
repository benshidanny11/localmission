import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
  missionDetails: [],
  loading: false,
  error: null,
  hasFetched: false,
};

// Async thunk to create mission details
export const createMissionDetails = createAsyncThunk(
  'missionDetails/createMissionDetails',
  async (missionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/missionDetails/create', missionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error.response)
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const resubmitMissionDetails = createAsyncThunk(
  'missionDetails/ResubmitMissionDetails',
  async ({referenceId, missionData}, { rejectWithValue }) => {
    try {
      missionData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axiosInstance.patch(`/missionDetails/resubmit-mission-request?referenceId=${referenceId}`, missionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error.response)
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


export const submitMissionReport = createAsyncThunk(
  'missionDetails/submitMissionReport',
  async ({referenceId, missionData}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/missionDetails/submit-report?referenceId=${referenceId}`, missionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const cancelMissionReport = createAsyncThunk(
  'missionDetails/cancelMissionReport',
  async (referenceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/missionDetails/cancel-mission-report?referenceId=${referenceId}`);
      return response.data.data;
    } catch (error) {
      console.log(error.response)
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const claimRefund = createAsyncThunk(
  'missionDetails/claimRefund',
  async ({referenceId, missionData}, { rejectWithValue }) => {
    try {
      console.log(missionData);
      const response = await axiosInstance.patch(`/missionDetails/submit-refund-claim?referenceId=${referenceId}`, missionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error.response)
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to fetch mission details by ID
export const fetchMissionDetails = createAsyncThunk(
  'missionDetails/fetchMissionDetails',
  async (_, { rejectWithValue }) => { // Note the `_` for unused first argument
    try {
      const response = await axiosInstance.get('/missionDetails/my-missions');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const missionDetailsSlice = createSlice({
  name: 'missionDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.missionDetails.unshift(action.payload);
      })
      .addCase(createMissionDetails.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(resubmitMissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resubmitMissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(resubmitMissionDetails.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(submitMissionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMissionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(submitMissionReport.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelMissionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelMissionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(cancelMissionReport.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(claimRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(claimRefund.rejected, (state, action) => {
        state.loading = false;
      })
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
        state.error = null;
      });
  },
});

export default missionDetailsSlice.reducer;
