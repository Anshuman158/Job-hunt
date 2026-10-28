import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { Briefcase, Plus, Search, Users, Calendar, MapPin, Eye } from 'lucide-react';

const AdminJobs = () => {
  const { allAdminJobs, fetchAdminJobs, loading } = useJob();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminJobs();
  }, [fetchAdminJobs]);

  const filteredJobs = allAdminJobs.filter((job) => {
    const titleMatch = job.title?.toLowerCase().includes(search.toLowerCase());
    const companyMatch = job.company?.name?.toLowerCase().includes(search.toLowerCase());
    return titleMatch || companyMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Posted Jobs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review and manage all job listings you've posted across companies
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter jobs by title or company..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 font-outfit">Company</th>
                  <th className="py-4 px-6 font-outfit">Role / Title</th>
                  <th className="py-4 px-6 font-outfit">Date Posted</th>
                  <th className="py-4 px-6 font-outfit">Location</th>
                  <th className="py-4 px-6 font-outfit">Applicants</th>
                  <th className="py-4 px-6 font-outfit text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      Loading posted jobs...
                    </td>
                  </tr>
                ) : filteredJobs.length <= 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      No jobs posted yet. Click "Post New Job" above to create your first listing.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {job.company?.name || "Company"}
                      </td>
                      <td className="py-4 px-6 text-slate-800 font-medium">
                        <div>
                          <span>{job.title}</span>
                          <span className="block text-[11px] text-purple-600 font-semibold mt-0.5">
                            {job.salary} LPA • {job.jobType}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(job.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location || "Remote"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                          <Users className="w-3.5 h-3.5" />
                          {job.applications?.length || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-600 text-xs font-bold transition-all"
                          title="View Applicants"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Applicants</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobs;

