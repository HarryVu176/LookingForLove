import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import matchService from '../../services/matchService';
import { IMatch, IMatchResult } from '../../types/match';

interface MatchesState {
  matches: IMatchResult[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  isLoading: false,
  error: null
};

export const getMatches = createAsyncThunk(
  'matches/getMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchService.getMatches();
      return response.matches;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get matches');
    }
  }
);

export const exposeContactInfo = createAsyncThunk(
  'matches/exposeContactInfo',
  async (matchedUserId: string, { rejectWithValue }) => {
    try {
      const response = await matchService.exposeContactInfo(matchedUserId);
      return response.match;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to expose contact information');
    }
  }
);

export const rateMatch = createAsyncThunk(
  'matches/rateMatch',
  async ({ matchedUserId, rating }: { matchedUserId: string, rating: number }, { rejectWithValue }) => {
    try {
      const response = await matchService.rateMatch(matchedUserId, rating);
      return response.match;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to rate match');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearMatchesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMatches.fulfilled, (state, action: PayloadAction<IMatchResult[]>) => {
        state.isLoading = false;
        state.matches = action.payload;
      })
      .addCase(getMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(exposeContactInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exposeContactInfo.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exposeContactInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(rateMatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rateMatch.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(rateMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearMatchesError } = matchesSlice.actions;
export default matchesSlice.reducer;
