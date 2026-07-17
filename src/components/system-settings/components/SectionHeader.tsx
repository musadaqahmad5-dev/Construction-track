import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'text-emerald-400 border-emerald-500/10 bg-emerald-950/20'
}) => {
  return (
    <div className="pb-3 border-b border-white/5 flex justify-between items-start md:items-center flex-wrap gap-2 text-left">
      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
        {subtitle && <p className="text-[10.5px] text-zinc-400 leading-normal">{subtitle}</p>}
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
  );
};
