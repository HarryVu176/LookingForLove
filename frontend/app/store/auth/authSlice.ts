import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ILoginRequest, IRegisterRequest, IUserProfile } from '../../types/user';
import authService from '../../services/authService';

// Define the IAuthResult interface to match the service response
interface IAuthResult {
  success: boolean;
  token?: string;
  user?: IUserProfile;
  message?: string;
}

interface AuthState {
  user: IUserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData: IRegisterRequest, { rejectWithValue }) => {
    const response = await authService.register(userData);
    
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    
    return response;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginRequest, { rejectWithValue }) => {
    const response = await authService.login(credentials);
    
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    
    return response;
  }
);

export const upgradeMembership = createAsyncThunk(
  'auth/upgrade',
  async (_, { rejectWithValue }) => {
    const response = await authService.upgradeMembership();
    
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<IAuthResult>) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IAuthResult>) => {
        state.isLoading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(upgradeMembership.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upgradeMembership.fulfilled, (state, action: PayloadAction<IAuthResult>) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
      })
      .addCase(upgradeMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
