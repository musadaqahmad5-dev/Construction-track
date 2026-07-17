import React, { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  height?: string;
  className?: string;
  children: ReactNode;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  subtitle,
  height = 'h-48',
  className = '',
  children
}) => {
  return (
    <div className={`bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left ${className}`}>
      <div className="pb-2 border-b border-white/5 flex justify-between items-start md:items-center flex-wrap gap-2">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-white tracking-tight">{title}</h4>
          {subtitle && <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
      <div className={`relative ${height} flex items-center justify-center`}>
        {children}
      </div>
    </div>
  );
};
