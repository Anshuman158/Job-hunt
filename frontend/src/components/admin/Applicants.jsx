import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { 
  Users, ArrowLeft, FileText, CheckCircle2, 
  XCircle, Clock, ExternalLink, Calendar, Mail, Phone 
} from 'lucide-react';

const Applicants = () => {
  const { id } = useParams();
  const { fetchApplicants, updateApplicantStatus } = useJob();
  const navigate = useNavigate();

  const [jobWithApplicants, setJobWithApplicants] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadApplicants = async () => {
    setLoading(true);
    const data = await fetchApplicants(id);
    setJobWithApplicants(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      loadApplicants();
    }
  }, [id]);

  const handleStatusChange = async (applicationId, status) => {
    const res = await updateApplicantStatus(applicationId, status);
    if (res.success) {
      // Refresh applicants list
      loadApplicants();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const applications = jobWithApplicants?.applications || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full space-y-6">
        <button
          onClick={() => navigate("/admin/jobs")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
              <span>{jobWithApplicants?.company?.name || "Company"}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Applicants ({applications.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Candidates who applied for <span className="font-semibold text-slate-700">"{jobWithApplicants?.title || 'Job'}"</span>
            </p>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 font-outfit">Candidate</th>
                  <th className="py-4 px-6 font-outfit">Contact Info</th>
                  <th className="py-4 px-6 font-outfit">Resume</th>
                  <th className="py-4 px-6 font-outfit">Applied Date</th>
                  <th className="py-4 px-6 font-outfit">Status</th>
                  <th className="py-4 px-6 font-outfit text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      Loading applicants...
                    </td>
                  </tr>
                ) : applications.length <= 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      No applicants yet for this job listing.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => {
                    const applicant = app.applicant;
                    const status = (app.status || 'pending').toLowerCase();
                    return (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {applicant?.profile?.profilePhoto ? (
                              <img
                                src={applicant.profile.profilePhoto}
                                alt={applicant.fullname}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                                {applicant?.fullname?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-slate-900">{applicant?.fullname || "Unknown"}</h4>
                              <p className="text-xs text-slate-400">{applicant?.profile?.bio || "Candidate"}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{applicant?.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{applicant?.phoneNumber || "N/A"}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {applicant?.profile?.resume ? (
                            <a
                              href={applicant.profile.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Resume</span>
                              <ExternalLink className="w-3 h-3 text-purple-400" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No resume attached</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(app.createdAt)}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {status === 'accepted' ? (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                              Accepted
                            </span>
                          ) : status === 'rejected' ? (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                              Rejected
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusChange(app._id, 'accepted')}
                              disabled={status === 'accepted'}
                              className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-bold ${
                                status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed opacity-60'
                                  : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                              }`}
                              title="Accept Application"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Accept</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              disabled={status === 'rejected'}
                              className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-bold ${
                                status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed opacity-60'
                                  : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
                              }`}
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

export default Applicants;

