import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Upload, Loader2 } from 'lucide-react';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null
  });

  if (!open) return null;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }

    const res = await updateProfile(formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold text-slate-900 font-outfit mb-1">
          Update Profile
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Make changes to your profile here. Click save when you're done.
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows={2}
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="e.g. Experienced MERN stack developer..."
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="React, Node.js, Express, MongoDB, Tailwind"
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Resume (PDF or Document)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-400 cursor-pointer bg-slate-50 hover:bg-purple-50/40 transition-colors">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-slate-600">
                  {input.file ? input.file.name : "Select or replace resume file"}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileDialog;
