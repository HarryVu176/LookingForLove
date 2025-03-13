import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


let API_URL = 'http://localhost:5000/api';

// Automatically adjust for Android emulator
if (Platform.OS === 'android') {
  API_URL = 'http://10.0.2.2:5000/api';
}


console.log('Using API URL:', API_URL); // Log the URL being used

export class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await AsyncStorage.getItem('token');
          
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
          } else {
            console.log(`No token available for request: ${config.method?.toUpperCase()} ${config.url}`);
          }
          
          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error);
          return config;
        }
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`Response success: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        if (!error.response) {
          console.error('Network error - no response received');
          return Promise.reject(error);
        }
        
        console.log(`Response error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${error.response?.status})`);
        console.log('Error message:', error.response?.data?.message);
        
        // Handle token expiration or unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('Received 401 error for request:', originalRequest.url);
          
          // Only clear token if it's explicitly an invalid token error
          // This prevents clearing the token for other 401 errors
          if (error.response?.data?.message === 'Invalid or expired token' || 
              error.response?.data?.message === 'Invalid token') {
            console.log('Clearing token due to invalid token error');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // Don't automatically redirect - let the component handle it
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export default new ApiService();
