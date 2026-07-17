import React from 'react';

interface ProgressGaugeProps {
  value: number; // 0 to 100
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const ProgressGauge: React.FC<ProgressGaugeProps> = ({
  value,
  label,
  size = 'md',
  color = 'stroke-emerald-400'
}) => {
  const radius = size === 'sm' ? 18 : size === 'md' ? 24 : 32;
  const stroke = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizeClasses = size === 'sm' ? 'w-12 h-12 text-[10px]' : size === 'md' ? 'w-16 h-16 text-[12px]' : 'w-24 h-24 text-[16px]';

  return (
    <div className="flex flex-col items-center justify-center space-y-1.5">
      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="stroke-white/5"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`${color} transition-all duration-500 ease-out`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute font-mono font-semibold text-white">{value}%</span>
      </div>
      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest text-center">{label}</span>
    </div>
  );
};
