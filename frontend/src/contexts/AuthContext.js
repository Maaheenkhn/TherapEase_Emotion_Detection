import React, { createContext, useContext, useState } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Custom Hook for accessing Auth Context
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component for managing user authentication and session data.
 * Provides user data and authentication functions to children components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store authenticated user info

  const login = (userData) => {
    setUser(userData); // Save user data on login
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
