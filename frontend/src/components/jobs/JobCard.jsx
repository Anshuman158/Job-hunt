import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, MapPin, Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const daysAgo = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    return daysAgo <= 0 ? "Today" : `${daysAgo}d ago`;
  };

  const hasExternalApply = Boolean(job?.applyUrl && job.applyUrl.trim().length > 0);

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Meta: Time ago, Source, and Bookmark */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-700 text-[11px]">Live Hiring</span>
            <span className="text-slate-300">•</span>
            <span>{daysAgoFunction(job?.createdAt)}</span>
          </div>

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
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center border border-purple-100 text-sm font-outfit">
              {job?.company?.name?.charAt(0) || "C"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-base truncate font-outfit">
              {job?.company?.name || job?.companyName || "Company"}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{job?.location || "Remote"}</span>
            </p>
          </div>
        </div>

        {/* Job Title & Description */}
        <h2 
          onClick={() => navigate(`/description/${job?._id}`)}
          className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-purple-600 transition-colors font-outfit line-clamp-1 cursor-pointer"
        >
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
          {job?.source && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-500">
              {job.source}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="flex-1 py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors text-center"
        >
          View Details
        </button>

        {hasExternalApply ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-purple-500/20"
          >
            <span>Apply ↗</span>
          </a>
        ) : (
          <button
            onClick={() => navigate(`/description/${job?._id}`)}
            className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-slate-900 hover:bg-purple-600 text-white transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
