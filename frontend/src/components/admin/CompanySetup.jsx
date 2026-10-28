import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useCompany } from '../../context/CompanyContext';
import { 
  Building2, Globe, MapPin, AlignLeft, 
  Upload, ArrowLeft, Loader2, Image as ImageIcon 
} from 'lucide-react';

const CompanySetup = () => {
  const { id } = useParams();
  const { fetchCompanyById, updateCompany, loading, singleCompany } = useCompany();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
    }
  }, [id]);

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null
      });
      if (singleCompany.logo) {
        setPreview(singleCompany.logo);
      }
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    const res = await updateCompany(id, formData);
    if (res.success) {
      navigate("/admin/companies");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 my-10 w-full space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/admin/companies")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            {preview ? (
              <img
                src={preview}
                alt="Logo preview"
                className="w-16 h-16 rounded-2xl object-contain bg-slate-50 p-2 border border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-2xl font-outfit">
                {input.name?.charAt(0).toUpperCase() || 'C'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
                Company Setup
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Complete your company profile to start posting job listings
              </p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={input.name}
                    onChange={changeEventHandler}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    placeholder="https://company.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Location / HQ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    placeholder="e.g. Bangalore, Hyderabad, Remote"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Logo File */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Logo
                </label>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-purple-500 cursor-pointer bg-slate-50 hover:bg-purple-50/30 transition-colors">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-slate-600 truncate">
                    {input.file ? input.file.name : "Choose logo file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Give a brief description of what your company does and company culture..."
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
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Update Company</span>
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

export default CompanySetup;

