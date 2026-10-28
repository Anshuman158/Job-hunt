import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Pen, FileText, ExternalLink } from 'lucide-react';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const isHaveResume = Boolean(user?.profile?.resume);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full space-y-8">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative">
          {/* Edit button */}
          <button
            onClick={() => setOpen(true)}
            className="absolute top-6 right-6 p-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors shadow-sm"
            title="Edit Profile"
          >
            <Pen className="w-4 h-4" />
          </button>

          {/* User Info Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            {user?.profile?.profilePhoto ? (
              <img
                src={user.profile.profilePhoto}
                alt={user?.fullname}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-3xl shadow-md font-outfit">
                {user?.fullname?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
                {user?.fullname}
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                {user?.profile?.bio || "No bio added yet. Click edit to add your bio and experience."}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="py-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-medium">{user?.phoneNumber || "N/A"}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="py-5 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit mb-3">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {user?.profile?.skills && user.profile.skills.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No skills added yet.</span>
              )}
            </div>
          </div>

          {/* Resume */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit mb-3">
              Resume Document
            </h3>
            {isHaveResume ? (
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noreferrer"
                download={user?.profile?.resumeOriginalName || "Resume.pdf"}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 text-purple-300" />
                <span>{user?.profile?.resumeOriginalName || "View & Download Resume"}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
              </a>
            ) : (
              <p className="text-xs text-slate-400">No resume uploaded. Update your profile to attach a resume.</p>
            )}
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit mb-4">
            Applied Jobs History
          </h2>
          <AppliedJobTable />
        </div>

        {/* Update Profile Dialog */}
        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
