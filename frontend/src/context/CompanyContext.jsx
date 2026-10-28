import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../utils/constant';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [singleCompany, setSingleCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth();
  const toast = useToast();

  const getAuthHeaders = useCallback((isMultipart = false) => {
    const headers = {};
    if (!isMultipart) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchCompanies = useCallback(async () => {
    if (!token && !user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, [token, user, getAuthHeaders]);

  const fetchCompanyById = async (companyId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        setSingleCompany(res.data.company);
        return res.data.company;
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const registerCompany = async (companyName) => {
    setLoading(true);
    try {
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "Company registered successfully!");
        setSingleCompany(res.data.company);
        await fetchCompanies();
        return { success: true, company: res.data.company };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to register company.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (companyId, formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${companyId}`, formData, {
        headers: getAuthHeaders(true),
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "Company information updated.");
        setSingleCompany(res.data.company);
        await fetchCompanies();
        return { success: true, company: res.data.company };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update company.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      fetchCompanies();
    }
  }, [user, fetchCompanies]);

  return (
    <CompanyContext.Provider value={{
      companies,
      singleCompany,
      loading,
      fetchCompanies,
      fetchCompanyById,
      registerCompany,
      updateCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
