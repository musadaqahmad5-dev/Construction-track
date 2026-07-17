import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  badge,
  badgeColor,
  className = '',
  onClick,
  children
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left transition-all ${
        onClick ? 'cursor-pointer hover:border-white/10' : ''
      } ${className}`}
    >
      {(title || badge) && (
        <div className="pb-2 border-b border-white/5 flex justify-between items-center flex-wrap gap-2">
          {title && (
            <div>
              {subtitle && <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block">{subtitle}</span>}
              <h4 className="text-xs font-bold text-white tracking-tight">{title}</h4>
            </div>
          )}
          {badge && (
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${badgeColor || 'bg-white/5 text-zinc-400'}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};
