import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const MOCK_ACCOUNTS = {
  admin: {
    name: 'Sarah (Platform Admin)',
    email: 'admin@techhub.com',
    role: 'admin',
    avatarBg: 'bg-rose-500 text-white'
  },
  vendor: {
    name: 'Apple Store Inc.',
    email: 'vendor@techhub.com',
    role: 'vendor',
    storeName: 'Apple Official Store',
    avatarBg: 'bg-slate-800 text-white'
  },
  customer: {
    name: 'Alex Johnson',
    email: 'customer@techhub.com',
    role: 'customer',
    avatarBg: 'bg-blue-600 text-white'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('techhub_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing session data', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check mock accounts first
    const matchedRole = Object.keys(MOCK_ACCOUNTS).find(
      (key) => MOCK_ACCOUNTS[key].email.toLowerCase() === email.toLowerCase()
    );

    if (matchedRole) {
      const loggedUser = MOCK_ACCOUNTS[matchedRole];
      setUser(loggedUser);
      localStorage.setItem('techhub_session', JSON.stringify(loggedUser));
      setIsLoading(false);
      return loggedUser;
    }

    // Check dynamic users registered in localStorage
    const savedUsers = JSON.parse(localStorage.getItem('techhub_registered_users') || '[]');
    const registeredUser = savedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (registeredUser) {
      const { password, ...safeUser } = registeredUser;
      const avatarColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600'];
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
      
      const loggedUser = {
        ...safeUser,
        avatarBg: `${randomColor} text-white`
      };
      setUser(loggedUser);
      localStorage.setItem('techhub_session', JSON.stringify(loggedUser));
      setIsLoading(false);
      return loggedUser;
    }

    setIsLoading(false);
    throw new Error('Invalid email or password. Use demo accounts for testing.');
  };

  const register = async (name, email, password, role, storeName = '') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if email already exists in mock accounts
    const isMockReserved = Object.keys(MOCK_ACCOUNTS).some(
      (key) => MOCK_ACCOUNTS[key].email.toLowerCase() === email.toLowerCase()
    );

    const savedUsers = JSON.parse(localStorage.getItem('techhub_registered_users') || '[]');
    const isDynamicTaken = savedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (isMockReserved || isDynamicTaken) {
      setIsLoading(false);
      throw new Error('Email address is already registered.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password, // in a mock scenario we store plain text
      role,
      storeName: role === 'vendor' ? storeName : undefined
    };

    savedUsers.push(newUser);
    localStorage.setItem('techhub_registered_users', JSON.stringify(savedUsers));

    // Automatically login after registration
    const { password: _, ...safeUser } = newUser;
    const avatarColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600'];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    
    const loggedUser = {
      ...safeUser,
      avatarBg: `${randomColor} text-white`
    };

    setUser(loggedUser);
    localStorage.setItem('techhub_session', JSON.stringify(loggedUser));
    setIsLoading(false);
    return loggedUser;
  };

  const logout = () => {
    setUser(null);
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
