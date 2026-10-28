import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useJob } from '../../context/JobContext';
import { Sparkles } from 'lucide-react';

const LatestJobs = () => {
  const { allJobs, loading } = useJob();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Careers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
            <span className="text-purple-600">Latest & Top </span>Job Openings
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-48" />
          ))}
        </div>
      ) : allJobs.length <= 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">No Job Openings Available Right Now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs.slice(0, 9).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
