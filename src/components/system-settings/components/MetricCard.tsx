import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  progressValue?: number;
  progressColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  progressValue,
  progressColor = 'bg-emerald-500'
}) => {
  return (
    <div className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between text-left">
      <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{label}</span>
      <div className="space-y-1">
        <span className="text-lg font-mono text-white font-light">{value}</span>
        {subValue && <span className="text-[9px] font-mono text-zinc-500 block leading-none">{subValue}</span>}
        {progressValue !== undefined && (
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progressValue}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};
