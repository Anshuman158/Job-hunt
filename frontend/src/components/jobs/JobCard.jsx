import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, MapPin, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Today";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const daysAgo = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Meta: Time ago and Bookmark */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{daysAgoFunction(job?.createdAt)}</span>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors"
            title={isSaved ? "Saved" : "Save for later"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Company Header */}
        <div className="flex items-center gap-3 mb-3">
          {job?.company?.logo ? (
            <img
              src={job?.company?.logo}
              alt={job?.company?.name}
              className="w-11 h-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center border border-purple-100">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-base line-clamp-1 font-outfit">
              {job?.company?.name || "Company"}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {job?.location || "India"}
            </p>
          </div>
        </div>

        {/* Job Title & Description */}
        <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors font-outfit line-clamp-1">
          {job?.title}
        </h2>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job?.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            {job?.position || 1} Positions
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
            {job?.jobType || "Full Time"}
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            {job?.salary} LPA
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-slate-900 hover:bg-purple-600 text-white transition-colors"
        >
          Details
        </button>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
            isSaved
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isSaved ? "Saved" : "Save For Later"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
