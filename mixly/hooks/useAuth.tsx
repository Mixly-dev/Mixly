import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  saveTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export function useAuthProvider(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getItem(TOKEN_KEY);
      setAccessToken(token);
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokens = useCallback(async (access: string, refresh: string) => {
    await setItem(TOKEN_KEY, access);
    await setItem(REFRESH_TOKEN_KEY, refresh);
    setAccessToken(access);
    setIsAuthenticated(true);
  }, []);

  const clearTokens = useCallback(async () => {
    await deleteItem(TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  const getAccessToken = useCallback(async () => {
    return getItem(TOKEN_KEY);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    accessToken,
    saveTokens,
    clearTokens,
    getAccessToken,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
