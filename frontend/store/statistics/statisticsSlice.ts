import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import statisticsService from '../../services/statisticsService';
import { IStatistics, IMatchQualityStatistics } from '../../types/statistics';

interface StatisticsState {
  statistics: IStatistics | null;
  matchQualityStatistics: IMatchQualityStatistics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  statistics: null,
  matchQualityStatistics: null,
  isLoading: false,
  error: null
};

export const getStatistics = createAsyncThunk(
  'statistics/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticsService.getStatistics();
      return response.statistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get statistics');
    }
  }
);

export const updateStatistics = createAsyncThunk(
  'statistics/updateStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticsService.updateStatistics();
      return response.statistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update statistics');
    }
  }
);

export const getMatchQualityStatistics = createAsyncThunk(
  'statistics/getMatchQualityStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticsService.getMatchQualityStatistics();
      return response.statistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get match quality statistics');
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatisticsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStatistics.fulfilled, (state, action: PayloadAction<IStatistics>) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStatistics.fulfilled, (state, action: PayloadAction<IStatistics>) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(updateStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getMatchQualityStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMatchQualityStatistics.fulfilled, (state, action: PayloadAction<IMatchQualityStatistics>) => {
        state.isLoading = false;
        state.matchQualityStatistics = action.payload;
      })
      .addCase(getMatchQualityStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearStatisticsError } = statisticsSlice.actions;
export default statisticsSlice.reducer;
