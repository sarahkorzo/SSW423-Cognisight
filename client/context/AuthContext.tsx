"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>; // No parameters
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/check-auth", {
          withCredentials: true,
        });
        setUser(res.data.username);
        setError(null);
      } catch (err) {
        setUser(null);
        setError("Failed to authenticate");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/check-auth", {
        withCredentials: true,
      });
      setUser(res.data.username);
      setError(null);
    } catch (err) {
      setUser(null);
      setError("Failed to authenticate");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      setError("Failed to logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
