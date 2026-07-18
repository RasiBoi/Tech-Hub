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
    status: user.status,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Guard so React Strict Mode's double-mount doesn't fire two /me requests.
  const isInitializing = React.useRef(false);

  // Load user from localStorage on init and fetch current profile from API
  useEffect(() => {
    const initAuth = async () => {
      if (isInitializing.current) return;
      isInitializing.current = true;

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
      // Keep flag true so the effect can't re-run (the [] dep ensures it only
      // runs once anyway, but this guards against Strict Mode's double-invoke).
    };

    initAuth();
  }, []);

  const isLoggingIn = React.useRef(false);

  const login = async (email, password) => {
    // Guard against double-submit (fast double-click / React Strict Mode)
    if (isLoggingIn.current) return;
    isLoggingIn.current = true;
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
    } finally {
      isLoggingIn.current = false;
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

  const updateUser = (updatedUser) => {
    const formatted = formatUser(updatedUser);
    setUser(formatted);
    localStorage.setItem('techhub_session', JSON.stringify(formatted));
  };

  const isLoggingOut = React.useRef(false);

  const logout = async () => {
    // Guard against concurrent/double logout calls (e.g. React Strict Mode, fast double-click)
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    try {
      await requestJson(`${serviceRegistry.catalog}/logout`, { method: 'POST' });
    } catch (e) {
      console.error('Logout error on server', e);
    } finally {
      isLoggingOut.current = false;
    }
    setUser(null);
    localStorage.removeItem('techhub_token');
    localStorage.removeItem('techhub_session');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
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
