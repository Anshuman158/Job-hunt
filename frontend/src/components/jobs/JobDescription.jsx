import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Building2, MapPin, Calendar, Users, Briefcase, 
  DollarSign, Award, ArrowLeft, CheckCircle2, ExternalLink, Globe, Sparkles 
} from 'lucide-react';

const JobDescription = () => {
  const { id } = useParams();
  const { fetchJobById, singleJob, applyJob, loading } = useJob();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }
  }, [id]);

  // Check if current user is already an applicant
  const isApplied = singleJob?.applications?.some((application) => {
    const applicantId = typeof application === 'object' ? (application.applicant?._id || application.applicant) : application;
    return applicantId === user?._id;
  }) || false;

  const handleApply = async () => {
    if (!user) {
      toast.info("Please login to track or apply for this job.");
      navigate("/login");
      return;
    }
    if (user.role === 'recruiter') {
      toast.error("Recruiters cannot apply for jobs. Please log in as a student.");
      return;
    }

    setIsApplying(true);
    await applyJob(id);
    setIsApplying(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasExternalApply = Boolean(singleJob?.applyUrl && singleJob.applyUrl.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        {loading && !singleJob ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        ) : !singleJob ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">Job details not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Banner Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {singleJob?.company?.logo ? (
                    <img
                      src={singleJob?.company?.logo}
                      alt={singleJob?.company?.name}
                      className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-2 border border-slate-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <Building2 className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Hiring
                      </span>
                      {singleJob?.source && (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Source: {singleJob.source}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
                      {singleJob?.title}
                    </h1>
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>{singleJob?.company?.name || singleJob?.companyName || "Company"}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-500 font-normal">
                        <MapPin className="w-3.5 h-3.5" />
                        {singleJob?.location}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2.5 flex-wrap pt-1">
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    {singleJob?.position} Positions
                  </span>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                    {singleJob?.jobType}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                    {singleJob?.salary} LPA
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {hasExternalApply ? (
                  <>
                    <a
                      href={singleJob.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        // Automatically record in applied jobs if logged in as student
                        if (user && user.role === 'student' && !isApplied) {
                          handleApply();
                        }
                      }}
                      className="px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
                    >
                      <span>Apply on Official Website</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      disabled={isApplied || isApplying}
                      onClick={handleApply}
                      className={`px-4 py-3 rounded-2xl font-bold text-xs border transition-colors flex items-center justify-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                          : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700'
                      }`}
                      title="Keep track of this application in your Job Hunt profile"
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Tracked in Profile</span>
                        </>
                      ) : (
                        <span>Mark as Applied</span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    disabled={isApplied || isApplying}
                    onClick={handleApply}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                      isApplied
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 hover:shadow-purple-500/35 hover:scale-[1.02]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Already Applied</span>
                      </>
                    ) : isApplying ? (
                      <span>Submitting...</span>
                    ) : (
                      <span>Apply with Profile</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 font-outfit">
                  Role Overview & Responsibilities
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mt-4 whitespace-pre-line">
                  {singleJob?.description}
                </p>
              </div>

              {/* Requirements */}
              {singleJob?.requirements && singleJob?.requirements.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 font-outfit">
                    Key Requirements & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {singleJob.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info Grid */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 font-outfit">
                  Compensation & Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Role</p>
                      <p className="text-sm font-bold text-slate-800">{singleJob?.title}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Location</p>
                      <p className="text-sm font-bold text-slate-800">{singleJob?.location}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Experience Required</p>
                      <p className="text-sm font-bold text-slate-800">{singleJob?.experienceLevel} Years</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Salary</p>
                      <p className="text-sm font-bold text-slate-800">{singleJob?.salary} LPA</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Applicants Tracked</p>
                      <p className="text-sm font-bold text-slate-800">{singleJob?.applications?.length || 0}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Posted Date</p>
                      <p className="text-sm font-bold text-slate-800">{formatDate(singleJob?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobDescription;
