import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Create authentication context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Only use mock authentication for this demo
      if (credentials.email === 'admin@medlinkx.com' && credentials.password === 'admin123') {
        const mockUser = {
          id: 'mock-user-id',
          email: credentials.email,
          name: 'Admin User',
          role: 'Administrator',
          department: 'Administration'
        };
        
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        console.log('Mock login successful');
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password. Use admin@medlinkx.com / admin123' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};