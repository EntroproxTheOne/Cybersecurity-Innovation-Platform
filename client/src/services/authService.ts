import axios from 'axios';
import { User, LoginFormData, RegisterFormData, AuthUser } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: LoginFormData): Promise<AuthUser> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthUser> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateUser(userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userData._id}`, userData);
    return response.data.user;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await api.put('/users/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default api;
