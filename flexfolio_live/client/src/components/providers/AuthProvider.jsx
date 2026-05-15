"use client";

import { createContext, useContext, useEffect, useState, } from "react";

import { getCurrentUser } from "@/lib/api";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
  const loadUser = async () => {
    await fetchUser();
    setLoading(false);
  };

  loadUser();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);