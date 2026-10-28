import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Briefcase, GraduationCap, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student"
  });

  const { login, googleLogin, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigate("/admin/companies");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await login(input.email, input.password, input.role);
    if (res.success) {
      if (input.role === 'recruiter') {
        navigate("/admin/companies");
      } else {
        navigate("/");
      }
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'recruiter') {
      setInput({
        email: "shivani@gmail.com",
        password: "password123",
        role: "recruiter"
      });
    } else {
      setInput({
        email: "patel@gmail.com",
        password: "password123",
        role: "student"
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse?.credential) {
      const res = await googleLogin(credentialResponse.credential, input.role);
      if (res.success) {
        if (input.role === 'recruiter') {
          navigate("/admin/companies");
        } else {
          navigate("/");
        }
      }
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Card container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-purple-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Quick Demo Autofill Bar */}
            <div className="mb-6 p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white text-purple-700 hover:bg-purple-100/70 rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Candidate Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('recruiter')}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-100/70 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Recruiter Demo
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Role Radio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      input.role === 'student'
                        ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-2 ring-purple-600/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === 'student'}
                      onChange={changeEventHandler}
                      className="sr-only"
                    />
                    <GraduationCap className={`w-4 h-4 ${input.role === 'student' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Job Seeker</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      input.role === 'recruiter'
                        ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-2 ring-purple-600/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="recruiter"
                      checked={input.role === 'recruiter'}
                      onChange={changeEventHandler}
                      className="sr-only"
                    />
                    <ShieldCheck className={`w-4 h-4 ${input.role === 'recruiter' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Recruiter</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider text-[11px]">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <div className="flex justify-center w-full min-h-[44px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="100%"
                  text="continue_with"
                />
              </div>
            </form>

            {/* Footer / Switch link */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

