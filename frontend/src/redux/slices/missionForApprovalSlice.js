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
  'missionDetails/fetchMissionDetailsApproval',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hod/get-missions-for-approval');
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const submitForApproval = createAsyncThunk(
  'missionDetails/submitForApproval',
  async (reason, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/hod/submit-for-approval', reason, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to reject a mission
export const rejectMission = createAsyncThunk(
  'missionDetails/rejectMission',
  async ({ referenceId, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/hod/reject-mission?referenceId=${referenceId}`, {
        reason
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const rejectMissionReport = createAsyncThunk(
  'missionDetails/rejectMissionReport',
  async ({ referenceId, reason }, { rejectWithValue }) => {
    try {
      console.log(reason);
      const response = await axiosInstance.patch(`/hod/reject-mission-report?referenceId=${referenceId}`, reason, {
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

export const approverMissionReport = createAsyncThunk(
  'missionDetails/approverMissionReport',
  async ({ referenceId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/hod/approve-mission-report?referenceId=${referenceId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to cancel a mission
export const cancelMission = createAsyncThunk(
  'missionDetails/cancelMission',
  async ({ referenceId, reason }, { dispatch,rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/hod/cancel-mission?referenceId=${referenceId}`, {
        reason
      });
      return dispatch(fetchMissionDetails()).unwrap();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to return a mission
export const retunMission = createAsyncThunk(
  'missionDetails/returnMission',
  async ({ referenceId, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/hod/return-mission?referenceId=${referenceId}`, {
        reason
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const missionDetailsSlice = createSlice({
  name: 'missionDetailsApproval',
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
      .addCase(submitForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(submitForApproval.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(rejectMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectMission.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(rejectMission.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(retunMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retunMission.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(retunMission.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelMission.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(cancelMission.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(rejectMissionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectMissionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(rejectMissionReport.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(approverMissionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approverMissionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(approverMissionReport.rejected, (state, action) => {
        state.loading = false;
      });
      
  },
});

export default missionDetailsSlice.reducer;
