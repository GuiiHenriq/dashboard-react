'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authApi } from '@/lib/api-client';
import { storage } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!(user && token);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = storage.getToken();
        const storedUser = storage.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        storage.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        storage.setToken(response.token);
        storage.setUser(response.user);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(credentials);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        storage.setToken(response.token);
        storage.setUser(response.user);
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    storage.clearAuth();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
