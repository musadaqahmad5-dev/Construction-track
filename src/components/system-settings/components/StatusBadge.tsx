import React from 'react';

interface StatusBadgeProps {
  status: 'Optimized' | 'Functional' | 'Warning' | 'Blocked' | 'Production-Ready' | 'Beta' | 'Needs-Attention' | 'Critical' | 'Active' | 'Idle' | 'Analyzing' | 'Learning' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let styleClasses = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';

  if (['Optimized', 'Production-Ready', 'Active'].includes(status)) {
    styleClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/15';
  } else if (['Functional', 'Learning', 'Analyzing', 'Beta', 'Idle'].includes(status)) {
    styleClasses = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/15';
  } else if (['Warning', 'Needs-Attention'].includes(status)) {
    styleClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/15';
  } else if (['Blocked', 'Critical'].includes(status)) {
    styleClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/15';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${styleClasses}`}>
      {status}
    </span>
  );
};
