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
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
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

  public async getCurrentUser(): Promise<IUserProfile | null> {
    const userString = await AsyncStorage.getItem('user');
    
    if (userString) {
      return JSON.parse(userString);
    }
    
    return null;
  }
}

export default new AuthService();
