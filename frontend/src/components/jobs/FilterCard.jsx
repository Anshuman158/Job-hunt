import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const filterData = [
  {
    filterType: "Location",
    array: ["Bangalore", "Hyderabad", "Delhi NCR", "Mumbai", "Pune", "Chennai", "Noida", "Remote", "Remote (Global)"]
  },
  {
    filterType: "Role / Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Software Engineer", "DevOps Engineer", "Data Science", "Cloud Engineer", "Mobile Developer", "AI Engineer", "Product Engineer", "UI Engineer", "SDE", "System Engineer"]
  },
  {
    filterType: "Company",
    array: ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Uber", "Stripe", "Flipkart", "Swiggy", "Zomato", "Razorpay", "CRED", "PhonePe", "Zepto", "Meesho", "GitHub", "GitLab", "Cloudflare", "Vercel"]
  },
  {
    filterType: "Salary Range",
    array: ["0-20 LPA", "20-35 LPA", "35-50 LPA", "50+ LPA"]
  }
];

const FilterCard = ({ selectedValue, setSelectedValue }) => {
  const changeHandler = (value) => {
    setSelectedValue(value === selectedValue ? "" : value);
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm sticky top-24">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base font-outfit">
          <Filter className="w-4 h-4 text-purple-600" />
          <span>Filter Jobs</span>
        </div>
        {selectedValue && (
          <button
            onClick={() => setSelectedValue("")}
            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterData.map((data, index) => (
          <div key={index} className="space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-outfit">
              {data.filterType}
            </h3>
            <div className="space-y-2">
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                const isChecked = selectedValue.toLowerCase() === item.toLowerCase();
                return (
                  <label
                    key={itemId}
                    htmlFor={itemId}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      id={itemId}
                      name="job-filter"
                      value={item}
                      checked={isChecked}
                      onChange={() => changeHandler(item)}
                      className="w-3.5 h-3.5 text-purple-600 focus:ring-purple-500 border-slate-300"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
