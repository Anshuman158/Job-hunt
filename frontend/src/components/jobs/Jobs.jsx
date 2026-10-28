import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import FilterCard from './FilterCard';
import JobCard from './JobCard';
import Footer from '../shared/Footer';
import { useJob } from '../../context/JobContext';
import { SearchX } from 'lucide-react';

const Jobs = () => {
  const { allJobs, loading } = useJob();
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (selectedValue) {
      const filtered = allJobs.filter((job) => {
        const val = selectedValue.toLowerCase();
        const titleMatch = job.title?.toLowerCase().includes(val);
        const descMatch = job.description?.toLowerCase().includes(val);
        const locMatch = job.location?.toLowerCase().includes(val);

        // Salary range checks
        if (selectedValue === "0-15 LPA") {
          return job.salary <= 15;
        } else if (selectedValue === "15-30 LPA") {
          return job.salary > 15 && job.salary <= 30;
        } else if (selectedValue === "30-50 LPA") {
          return job.salary > 30 && job.salary <= 50;
        }

        return titleMatch || descMatch || locMatch;
      });
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, selectedValue]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Filter Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <FilterCard selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
          </div>

          {/* Right Job Cards Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider font-outfit">
                Showing {filterJobs.length} {filterJobs.length === 1 ? 'Job' : 'Jobs'}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-56" />
                ))}
              </div>
            ) : filterJobs.length <= 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 font-outfit">No Matching Jobs Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your filter options or clear the filters to explore other opportunities.
                </p>
                {selectedValue && (
                  <button
                    onClick={() => setSelectedValue("")}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filterJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
