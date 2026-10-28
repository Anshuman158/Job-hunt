import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("jobhunt_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("jobhunt_token") || "";
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem("jobhunt_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jobhunt_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jobhunt_token", token);
    } else {
      localStorage.removeItem("jobhunt_token");
    }
  }, [token]);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password, role }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.token) {
          setToken(res.data.token);
        }
        toast.success(res.data.message || "Logged in successfully!");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check credentials.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      setUser(null);
      setToken("");
      localStorage.removeItem("jobhunt_user");
      localStorage.removeItem("jobhunt_token");
      toast.success(res.data.message || "Logged out successfully!");
      return { success: true };
    } catch (error) {
      setUser(null);
      setToken("");
      localStorage.removeItem("jobhunt_user");
      localStorage.removeItem("jobhunt_token");
      toast.info("Logged out.");
      return { success: true };
    }
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "multipart/form-data"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers,
        withCredentials: true
      });

      if (res.data.success) {
        setUser(res.data.user);
        toast.success(res.data.message || "Profile updated successfully!");
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile }}>
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
