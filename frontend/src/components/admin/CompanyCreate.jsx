import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useCompany } from '../../context/CompanyContext';
import { Building2, ArrowRight, Loader2, X } from 'lucide-react';

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const { registerCompany, loading } = useCompany();
  const navigate = useNavigate();

  const registerNewCompany = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const res = await registerCompany(companyName);
    if (res.success && res.company) {
      const companyId = res.company._id;
      navigate(`/admin/companies/${companyId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 my-16 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
            Register Your Company
          </h1>
          <p className="text-xs text-slate-500 mt-1 mb-8 leading-relaxed">
            What would you like to name your company? You can change this and add logo, website, and location details later.
          </p>

          <form onSubmit={registerNewCompany} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google, Microsoft, Netflix, JobHunt..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/companies")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !companyName.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyCreate;

