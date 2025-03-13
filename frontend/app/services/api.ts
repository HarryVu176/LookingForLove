import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';


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
            // Only log on non-GET requests to reduce noise
            if (config.method && config.method.toUpperCase() !== 'GET') {
              console.log(`Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
            }
          } else if (!token) {
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
        // Only log non-GET responses to reduce noise
        if (response.config.method && response.config.method.toUpperCase() !== 'GET') {
          console.log(`Response success: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        if (!error.response) {
          console.error('Network error - no response received');
          return Promise.reject(error);
        }
        
        // Only log errors for non-GET requests or 401 errors
        if (originalRequest.method?.toUpperCase() !== 'GET' || error.response?.status === 401) {
          console.log(`Response error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${error.response?.status})`);
          console.log('Error message:', error.response?.data?.message);
        }
        
        // Handle token expiration or unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('Received 401 error for request:', originalRequest.url);
          
          // Only clear token if it's explicitly an invalid token error
          if (error.response?.data?.message === 'Invalid or expired token' || 
              error.response?.data?.message === 'Invalid token') {
            console.log('Clearing token due to invalid token error');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            
            // Emit an event for token expiration that components can listen to
            EventRegister.emit('tokenExpired', { reason: 'token_expired' });
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
    console.log(`Making PUT request to ${url} with data:`, JSON.stringify(data, null, 2));
    try {
      const response = await this.api.put<T>(url, data);
      console.log(`PUT response from ${url}:`, JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error(`PUT request to ${url} failed:`, error.message);
      throw error;
    }
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export default new ApiService();
