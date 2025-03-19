import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(); // Store user details (email, role, etc.)
    const [token, setToken] = useState(localStorage.getItem('token') || undefined); // Store JWT token

    // // Effect to check for token on app load
    // const checktoken = () => {
    //   const storedToken = localStorage.getItem('token');
    //   console.log(storedToken)
    //   if (storedToken) {
    //     const decodedToken = jwt_decode(storedToken);
    //     // setUser({ email: decodedToken.email, role: decodedToken.role });
    //     // setUser({ name: decodedToken.sub.name, role: decodedToken.sub.role }); // Set user details
    //     // setToken(storedToken);
    //     // Check if the token is expired
    //     if (decodedToken.exp < Date.now() / 1000) {
    //       // Token is expired, remove it from localStorage
    //       logout();

    //       // Token is valid, set user and token state
    //       setUser({ name: decodedToken.sub.name, role: decodedToken.sub.role });
    //       setToken(storedToken);
    //     }
    //   }
    // };

    // Function to log in the user
    const login = (token) => {
        localStorage.setItem('token', token); // Store token in localStorage
        setToken(token); // Update token state
        
        // console.log(token)
        const decodedToken = jwt_decode(token); // Decode token to get user details
        // console.log(decodedToken)
        // setUser({ name: decodedToken.name, role: decodedToken.role }); // Set user details
        setUser({ name: decodedToken.sub.name, role: decodedToken.sub.role }); // Set user details

    };

    // Function to log out the user
    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setToken(null); // Clear token state
        setUser(null); // Clear user state
    };

    // Check if the user is authenticated
    const isAuthenticated = () => {
      if (token === undefined) return undefined;
      console.log('checking token: ', token)
        return !!token; // Return true if token exists
    };

      console.log(user)

    // Check if the user has a specific role
    const hasRole = (requiredRole) => {
      if (user === undefined) return undefined;
        return user?.role === requiredRole; // Return true if the user has the required role
    };

    // Effect to check for token on app load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log(storedToken)
        if (storedToken) {
          console.log("Checking token");
          const decodedToken = jwt_decode(storedToken);
          // setUser({ email: decodedToken.email, role: decodedToken.role });
          // setUser({ name: decodedToken.sub.name, role: decodedToken.sub.role }); // Set user details
          // setToken(storedToken);
          // Check if the token is expired
          console.log(decodedToken)
          if (decodedToken.exp > new Date().getTime() / 1000) {
            // Token is expired, remove it from localStorage

            // Token is valid, set user and token state
            console.log(decodedToken);
            setUser({ name: decodedToken.sub.name, role: decodedToken.sub.role });
            setToken(storedToken);
          } else {
            logout();
          } 
        } else {
        logout()}
    }, []);

    /** If the user and token hasnt been loaded yet, this will be true */
    const isLoading = (user === undefined || token === undefined);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};