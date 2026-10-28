import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [singleJob, setSingleJob] = useState(null);
  const [allAdminJobs, setAllAdminJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth();
  const toast = useToast();

  const getAuthHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, [token]);

  // Fetch all jobs
  const fetchAllJobs = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${keyword}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setAllJobs(res.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch job by ID
  const fetchJobById = async (jobId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setSingleJob(res.data.job);
        return res.data.job;
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Fetch recruiter's jobs
  const fetchAdminJobs = useCallback(async () => {
    if (!token && !user) return;
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        setAllAdminJobs(res.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
    }
  }, [token, user, getAuthHeaders]);

  // Fetch student's applied jobs
  const fetchAppliedJobs = useCallback(async () => {
    if (!token && !user) return;
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        setAppliedJobs(res.data.application);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }, [token, user, getAuthHeaders]);

  // Apply to job
  const applyJob = async (jobId) => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "Job applied successfully!");
        // Refresh single job and applied jobs
        await fetchJobById(jobId);
        await fetchAppliedJobs();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to apply for job.";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Post job (recruiter)
  const postJob = async (jobData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "New job created successfully!");
        await fetchAllJobs();
        await fetchAdminJobs();
        return { success: true, job: res.data.job };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to post job.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for a job (recruiter)
  const fetchApplicants = async (jobId) => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        return res.data.job;
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    }
    return null;
  };

  // Update applicant status (recruiter: accepted / rejected)
  const updateApplicantStatus = async (applicationId, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status }, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "Status updated successfully!");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update status.";
      toast.error(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    fetchAllJobs(searchedQuery);
  }, [fetchAllJobs, searchedQuery]);

  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        fetchAdminJobs();
      } else {
        fetchAppliedJobs();
      }
    }
  }, [user, fetchAdminJobs, fetchAppliedJobs]);

  return (
    <JobContext.Provider value={{
      allJobs,
      singleJob,
      allAdminJobs,
      appliedJobs,
      searchedQuery,
      setSearchedQuery,
      loading,
      fetchAllJobs,
      fetchJobById,
      fetchAdminJobs,
      fetchAppliedJobs,
      applyJob,
      postJob,
      fetchApplicants,
      updateApplicantStatus
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
