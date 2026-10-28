import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import JobCard from '../jobs/JobCard';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { SearchX } from 'lucide-react';

const Browse = () => {
  const { allJobs, searchedQuery, fetchAllJobs, loading } = useJob();

  useEffect(() => {
    fetchAllJobs(searchedQuery);
  }, [searchedQuery, fetchAllJobs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex-1 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
            Search Results ({allJobs.length})
          </h1>
          {searchedQuery && (
            <p className="text-xs text-slate-500 mt-1">
              Showing opportunities matching <span className="font-semibold text-purple-600">"{searchedQuery}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-56" />
            ))}
          </div>
        ) : allJobs.length <= 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
            <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 font-outfit">No Jobs Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any positions matching your search. Try searching for different keywords or titles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
