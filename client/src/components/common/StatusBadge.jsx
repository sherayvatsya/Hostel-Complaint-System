import React from 'react';

const StatusBadge = ({ type, value }) => {
  const getStyles = () => {
    if (type === 'status') {
      switch (value) {
        case 'Pending':
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 shadow-neon-amber';
        case 'Accepted':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
        case 'In Progress':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 animate-pulse';
        case 'Resolved':
          return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50 shadow-neon-green';
        case 'Rejected':
          return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/50';
        default:
          return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      }
    } else if (type === 'priority') {
      switch (value) {
        case 'Low':
          return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        case 'Medium':
          return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30';
        case 'High':
          return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30 font-bold shadow-neon-rose animate-pulse';
        default:
          return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        value === 'In Progress' || value === 'High' ? 'bg-current animate-ping' : 'bg-current'
      }`} />
      {value}
    </span>
  );
};

export default StatusBadge;
