import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    background: '#0a0a0a',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(darkTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setTheme = (mode: 'light' | 'dark') => {
    const newTheme = mode === 'light' ? lightTheme : darkTheme;
    setThemeState(newTheme);
    localStorage.setItem('theme', mode);
    
    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const toggleTheme = () => {
    setTheme(theme.mode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Apply theme colors to CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
