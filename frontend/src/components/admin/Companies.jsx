import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useCompany } from '../../context/CompanyContext';
import { Building2, Plus, Search, Edit2, Calendar, MapPin, Globe } from 'lucide-react';

const Companies = () => {
  const { companies, fetchCompanies, loading } = useCompany();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Companies
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your registered corporate profiles and hiring entities
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/companies/create")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Company</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter companies by name..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-sm"
          />
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 font-outfit">Logo</th>
                  <th className="py-4 px-6 font-outfit">Company Name</th>
                  <th className="py-4 px-6 font-outfit">Location</th>
                  <th className="py-4 px-6 font-outfit">Website</th>
                  <th className="py-4 px-6 font-outfit">Date Registered</th>
                  <th className="py-4 px-6 font-outfit text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      Loading registered companies...
                    </td>
                  </tr>
                ) : filteredCompanies.length <= 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      No companies found. Click "New Company" above to register one.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            {company.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {company.name}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{company.location || "Not specified"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {company.website ? (
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Visit site</span>
                          </a>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(company.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="p-2 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors"
                          title="Edit Company Details"
                        >
                          <Edit2 className="w-4 h-4" />
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

export default Companies;

