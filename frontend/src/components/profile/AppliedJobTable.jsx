import React from 'react';
import { useJob } from '../../context/JobContext';
import { Clock } from 'lucide-react';

const AppliedJobTable = () => {
  const { appliedJobs } = useJob();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'accepted') {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
          Accepted
        </span>
      );
    } else if (s === 'rejected') {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
        Pending
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
          <tr>
            <th className="py-3.5 px-4 font-outfit">Date</th>
            <th className="py-3.5 px-4 font-outfit">Job Role</th>
            <th className="py-3.5 px-4 font-outfit">Company</th>
            <th className="py-3.5 px-4 font-outfit text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appliedJobs.length <= 0 ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">
                You haven't applied to any jobs yet.
              </td>
            </tr>
          ) : (
            appliedJobs.map((applied) => (
              <tr key={applied._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(applied.createdAt)}
                </td>
                <td className="py-4 px-4 font-bold text-slate-900">
                  {applied.job?.title || "Role"}
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">
                  {applied.job?.company?.name || "Company"}
                </td>
                <td className="py-4 px-4 text-right">
                  {getStatusBadge(applied.status)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobTable;
