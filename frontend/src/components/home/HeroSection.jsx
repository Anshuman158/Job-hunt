import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const { setSearchedQuery } = useJob();
  const navigate = useNavigate();

  const searchJobHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchedQuery(query.trim());
      navigate("/browse");
    }
  };

  return (
    <div className="relative pt-12 pb-16 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-indigo-400/20 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs sm:text-sm font-semibold tracking-wide shadow-sm mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>No. 1 Job Hunt Website</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 font-outfit">
          Search, Apply & <br />
          Get Your <span className="gradient-text">Dream Job</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore <span className="font-bold text-purple-600">100+ live job opportunities</span> at Google, Microsoft, Amazon, Swiggy, Razorpay & more. Direct "Apply on Official Website" links — no paywalls, no middlemen.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={searchJobHandler}
          className="max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-slate-200/90 p-2 transition-all focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-400"
        >
          <div className="flex items-center pl-3 text-slate-400">
            <Search className="w-5 h-5 text-purple-600" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your dream jobs (e.g. Frontend Developer, Hyderabad, React)..."
            className="w-full px-4 py-2.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 hover:shadow-purple-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
