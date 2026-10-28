import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Main pages
import Home from './components/home/Home';
import Jobs from './components/jobs/Jobs';
import JobDescription from './components/jobs/JobDescription';
import Browse from './components/browse/Browse';
import Profile from './components/profile/Profile';

// Auth pages
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Admin / Recruiter pages
import Companies from './components/admin/Companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from './components/admin/AdminJobs';
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants';

// Protected Route Guard
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/description/:id" element={<JobDescription />} />
        <Route path="/browse" element={<Browse />} />

        {/* Candidate / Student Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Recruiter / Admin Protected Routes */}
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/create"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CompanyCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CompanySetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <Applicants />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
              <h1 className="text-6xl font-extrabold text-purple-600 font-outfit mb-3">404</h1>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
              <p className="text-xs text-slate-500 mb-6 max-w-sm">
                The page you are looking for does not exist or has been moved.
              </p>
              <a
                href="/"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all"
              >
                Back to Home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

