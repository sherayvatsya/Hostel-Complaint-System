import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const getApiErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((err) => err.message).join(', ');
  }
  return fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();

    // Listen for global auth failure events from api.js
    const handleLogoutEvent = () => {
      setUser(null);
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  // Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Registration failed')
      };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
      }
      return {
        success: false,
        message: res.data.message || 'Invalid email or password'
      };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Invalid email or password')
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Failed to update profile')
      };
    }
  };

  // Change Password
  const changePassword = async (passwordData) => {
    try {
      const res = await api.put('/auth/password', passwordData);
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Failed to change password')
      };
    }
  };

  const fetchSecurityQuestion = async (email) => {
    try {
      const res = await api.get('/auth/forgot-password/question', { params: { email } });
      if (res.data.success) {
        return { success: true, securityQuestion: res.data.securityQuestion };
      }
      return { success: false, message: res.data.message || 'Unable to fetch security question' };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error, 'Unable to fetch security question') };
    }
  };

  const resetPassword = async (payload) => {
    try {
      const res = await api.post('/auth/forgot-password', payload);
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Password reset failed' };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error, 'Password reset failed') };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        fetchSecurityQuestion,
        resetPassword
      }}
    >
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
