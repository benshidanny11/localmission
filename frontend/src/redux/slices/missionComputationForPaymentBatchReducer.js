import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
    missionDetails: [],
    missionPaymentBatch: [],
    loading: false,
    error: null,
    hasFetchedForMissionDetails: false,
    hasFetchedForMissionPayment: false,
};


// Async thunk to fetch mission details by ID
export const fetchMissionDetails = createAsyncThunk(
    'missionDetails/fetchMissionDetailsComputed',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/missionDetails/mission-for-payment-batch');
            console.log(response.data);
            // console.log(hasFetchedForMissionDetails);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

export const fetchPaymentBatches = createAsyncThunk(
    'missionDetails/fetchPaymentBatches',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/payment/Batches');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

// Async thunk to cancel a mission
export const cancelMission = createAsyncThunk(
    'missionDetails/cancelPaymentBatch',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`payment/cancel/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

export const createPaymentBatch = createAsyncThunk(
    'missionDetails/createPaymentBatch',
    async (missionData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/payment', missionData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
    }
  );

const CcomputationForPaymentBatch = createSlice({
    name: 'missionDetailsApproval',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentBatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentBatch.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetchedForMissionDetails = false;
                state.hasFetchedForMissionPayment = false;
            })
            .addCase(createPaymentBatch.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchMissionDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMissionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.missionDetails = action.payload;
                state.hasFetchedForMissionDetails = true;
            })
            .addCase(fetchMissionDetails.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchPaymentBatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.missionPaymentBatch = action.payload;
                state.hasFetchedForMissionPayment = true;
            })
            .addCase(fetchPaymentBatches.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(cancelMission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelMission.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetchedForMissionPayment = false;
            })
            .addCase(cancelMission.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default CcomputationForPaymentBatch.reducer;