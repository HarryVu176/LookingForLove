import apiService from './api';
import { IAuthResponse, ILoginRequest, IRegisterRequest, IUserProfile } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IAuthResult {
  success: boolean;
  token?: string;
  user?: IUserProfile;
  message?: string;
}

export class AuthService {
  public async register(userData: IRegisterRequest): Promise<IAuthResult> {
    try {
      const response = await apiService.post<{ success: boolean; user: IUserProfile }>('/auth/register', userData);
      
      return {
        success: response.success,
        user: response.user
      };
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: userData
      });
      
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed (services/authService.ts)'
      };
    }
  }

  public async login(credentials: ILoginRequest): Promise<IAuthResult> {
    try {
      const response = await apiService.post<{ success: boolean } & IAuthResponse>('/auth/login', credentials);
      
      if (response.success && response.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return {
        success: response.success,
        token: response.token,
        user: response.user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  public async upgradeMembership(): Promise<IAuthResult> {
    try {
      const response = await apiService.post<{ success: boolean; user: IUserProfile }>('/auth/upgrade');
      
      if (response.success) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return {
        success: response.success,
        user: response.user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Upgrade failed'
      };
    }
  }

  public async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }

  public async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found in storage');
        return null;
      }
      
      // Check if token exists and is valid
      console.log('Token retrieved from storage');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  public async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const token = await this.getToken();
      
      // If no token exists, we can't refresh
      if (!token) {
        console.log('No token to refresh');
        return false;
      }
      
      // Get current user data to verify token is still valid
      try {
        const response = await apiService.get<{ success: boolean; user: IUserProfile }>('/auth/me');
        console.log('Token is valid, user data refreshed');
        
        // Update stored user data with latest from server
        if (response.success && response.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return true;
      } catch (error: any) {
        // If we get a 401 error, the token is invalid
        if (error.response?.status === 401) {
          console.log('Token refresh failed - invalid token');
          
          // Clear token and user data
          await this.logout();
          return false;
        }
        
        // For other errors, we'll assume the token is still valid
        // This prevents logout due to network issues
        console.warn('Token refresh encountered a non-auth error:', error);
        return true;
      }
    } catch (error) {
      console.error('Error in refreshTokenIfNeeded:', error);
      return false;
    }
  }

  public async getCurrentUser(): Promise<IUserProfile | null> {
    const userString = await AsyncStorage.getItem('user');
    
    if (userString) {
      return JSON.parse(userString);
    }
    
    return null;
  }
}

export default new AuthService();
