import React from 'react';
import { Briefcase, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit">
                Job<span className="text-purple-600">Hunt</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find, apply, and discover your career path with industry-leading companies and startups worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-outfit">For Candidates</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/jobs" className="hover:text-purple-600 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/browse" className="hover:text-purple-600 transition-colors">Trending Roles</Link></li>
              <li><Link to="/profile" className="hover:text-purple-600 transition-colors">Candidate Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-outfit">For Employers</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/signup" className="hover:text-purple-600 transition-colors">Recruiter Sign up</Link></li>
              <li><Link to="/admin/companies" className="hover:text-purple-600 transition-colors">Manage Companies</Link></li>
              <li><Link to="/admin/jobs" className="hover:text-purple-600 transition-colors">Post Openings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-outfit">Connect With Us</h4>
            <div className="flex gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for developers.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Job Hunt Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
