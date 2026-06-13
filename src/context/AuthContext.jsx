import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';

const AuthContext = createContext(null);


const formatUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    storeName: user.store_name || user.storeName,
    avatarBg: user.avatar_bg || user.avatarBg,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on init and fetch current profile from API
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('techhub_token');
      const savedUser = localStorage.getItem('techhub_session');

      if (token) {
        try {
          const profile = await requestJson(`${serviceRegistry.catalog}/me`);
          const formatted = formatUser(profile);
          setUser(formatted);
          localStorage.setItem('techhub_session', JSON.stringify(formatted));
        } catch (e) {
          console.error('Session verification failed, logging out', e);
          setUser(null);
          localStorage.removeItem('techhub_token');
          localStorage.removeItem('techhub_session');
        }
      } else if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await requestJson(`${serviceRegistry.catalog}/login`, {
        method: 'POST',
        body: { email, password }
      });
      const formatted = formatUser(data.user);
      setUser(formatted);
      localStorage.setItem('techhub_token', data.token);
      localStorage.setItem('techhub_session', JSON.stringify(formatted));
      setIsLoading(false);
      return formatted;
    } catch (e) {
      setIsLoading(false);
      throw new Error(e.message || 'Invalid email or password.');
    }
  };

  const register = async (name, email, password, role, storeName = '') => {
    setIsLoading(true);
    try {
      const data = await requestJson(`${serviceRegistry.catalog}/register`, {
        method: 'POST',
        body: { 
          name, 
          email, 
          password, 
          role, 
          store_name: storeName 
        }
      });
      const formatted = formatUser(data.user);
      setUser(formatted);
      localStorage.setItem('techhub_token', data.token);
      localStorage.setItem('techhub_session', JSON.stringify(formatted));
      setIsLoading(false);
      return formatted;
    } catch (e) {
      setIsLoading(false);
      throw new Error(e.message || 'Registration failed.');
    }
  };

  const logout = async () => {
    try {
      await requestJson(`${serviceRegistry.catalog}/logout`, { method: 'POST' });
    } catch (e) {
      console.error('Logout error on server', e);
    }
    setUser(null);
    localStorage.removeItem('techhub_token');
    localStorage.removeItem('techhub_session');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
