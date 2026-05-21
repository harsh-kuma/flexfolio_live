"use client";

import { getCurrentUser } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

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
    let active = true;

    const loadUser = async () => {
      try {
        const res = await getCurrentUser();

        if (active) {
          setUser(res.user);
        }
      } catch (err) {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
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