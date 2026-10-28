import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, ChevronDown, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setShowPopover(false);
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-outfit">
              Job<span className="text-purple-600">Hunt</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {user && user.role === 'recruiter' ? (
              <>
                <Link
                  to="/admin/companies"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/companies') ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Companies
                </Link>
                <Link
                  to="/admin/jobs"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/jobs') ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jobs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/') ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/jobs') ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/browse"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/browse') ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Browse
                </Link>
              </>
            )}
          </div>

          {/* Right Action / Profile */}
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 border border-slate-300 hover:border-purple-300 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Signup
                </Link>
              </div>
            ) : (
              <div className="relative" ref={popoverRef}>
                <button
                  onClick={() => setShowPopover(!showPopover)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  {user.profile?.profilePhoto ? (
                    <img
                      src={user.profile.profilePhoto}
                      alt={user.fullname}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center ring-2 ring-purple-500/30 text-sm">
                      {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Profile Popover / Dropdown */}
                {showPopover && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      {user.profile?.profilePhoto ? (
                        <img
                          src={user.profile.profilePhoto}
                          alt={user.fullname}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                          {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-900 truncate text-sm">{user.fullname}</h4>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-purple-50 text-purple-700">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {user.profile?.bio && (
                      <p className="text-xs text-slate-600 my-2.5 line-clamp-2 italic">
                        "{user.profile.bio}"
                      </p>
                    )}

                    <div className="pt-2 flex flex-col gap-1">
                      {user.role === 'student' && (
                        <Link
                          to="/profile"
                          onClick={() => setShowPopover(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50/60 rounded-xl transition-colors font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-purple-600" />
                          View Profile
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
