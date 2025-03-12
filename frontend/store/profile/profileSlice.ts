import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import profileService from '../../services/profileService';
import { IUser, ITechnicalSkill } from '../../types/user';

interface ProfileState {
  profile: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null
};

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      return response.profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<IUser>, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response.profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const updateTechnicalSkills = createAsyncThunk(
  'profile/updateTechnicalSkills',
  async (
    { skillsOwned, skillsDesired }: { skillsOwned: ITechnicalSkill[], skillsDesired: ITechnicalSkill[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.updateTechnicalSkills(skillsOwned, skillsDesired);
      return response.profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update technical skills');
    }
  }
);

export const updateProfilePhoto = createAsyncThunk(
  'profile/updateProfilePhoto',
  async (photoUrl: string, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfilePhoto(photoUrl);
      return response.profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile photo');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTechnicalSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTechnicalSkills.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateTechnicalSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfilePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
