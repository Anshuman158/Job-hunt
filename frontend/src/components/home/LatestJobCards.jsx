import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Company Header */}
        <div className="flex items-center gap-3 mb-3">
          {job?.company?.logo ? (
            <img
              src={job?.company?.logo}
              alt={job?.company?.name}
              className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center border border-purple-100">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-base line-clamp-1">
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
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
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
  );
};

export default LatestJobCards;
