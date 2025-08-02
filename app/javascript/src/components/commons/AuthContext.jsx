import React, { createContext, useContext, useState, useEffect } from "react";

import { either, isNil, isEmpty } from "ramda";

import { getFromLocalStorage } from "../../utils/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = () => {
    const authToken = getFromLocalStorage("authToken");
    const isAuthenticated = !either(isNil, isEmpty)(authToken);
    setIsLoggedIn(isAuthenticated);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = e => {
      if (e.key === "authToken") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
