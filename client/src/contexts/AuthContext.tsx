import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthUser, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
