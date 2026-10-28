import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { useCompany } from '../../context/CompanyContext';
import { 
  Briefcase, Building2, MapPin, DollarSign, 
  Clock, ArrowLeft, Loader2, AlertCircle, Plus 
} from 'lucide-react';

const PostJob = () => {
  const { postJob, loading } = useJob();
  const { companies, fetchCompanies } = useCompany();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full Time",
    experienceLevel: "",
    position: 1,
    companyId: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (companies.length > 0 && !input.companyId) {
      setInput(prev => ({ ...prev, companyId: companies[0]._id }));
    }
  }, [companies]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.companyId) return;

    const res = await postJob({ ...input, experience: input.experienceLevel });
    if (res.success) {
      navigate("/admin/jobs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 my-10 w-full space-y-6">
        <button
          onClick={() => navigate("/admin/jobs")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Posted Jobs</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

          <div className="mb-8 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Post a New Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Reach qualified students and experienced professionals looking for work
            </p>
          </div>

          {companies.length === 0 ? (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Please register a company first</h4>
                <p className="text-xs text-amber-700 mt-1">
                  You must have at least one registered company entity before you can publish job openings.
                </p>
                <Link
                  to="/admin/companies/create"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Company Now</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={input.title}
                    onChange={changeEventHandler}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Company Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Company
                  </label>
                  <select
                    name="companyId"
                    value={input.companyId}
                    onChange={changeEventHandler}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all bg-white"
                  >
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={input.location}
                    onChange={changeEventHandler}
                    placeholder="e.g. Hyderabad, Bangalore, Remote"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Salary (in LPA)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    required
                    min="0"
                    step="0.5"
                    value={input.salary}
                    onChange={changeEventHandler}
                    placeholder="e.g. 18"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={input.jobType}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Experience Level (Years)
                  </label>
                  <input
                    type="number"
                    name="experienceLevel"
                    required
                    min="0"
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    placeholder="e.g. 2"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Position Openings */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Number of Openings
                  </label>
                  <input
                    type="number"
                    name="position"
                    required
                    min="1"
                    value={input.position}
                    onChange={changeEventHandler}
                    placeholder="e.g. 3"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Requirements / Skills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Requirements (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="requirements"
                    required
                    value={input.requirements}
                    onChange={changeEventHandler}
                    placeholder="React, Redux, Node.js, TypeScript"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Description & Responsibilities
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Outline responsibilities, team structure, and qualifications needed..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Job Listing...</span>
                    </>
                  ) : (
                    <span>Post Job Now</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;
