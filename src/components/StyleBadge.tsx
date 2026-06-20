import React from 'react';

interface StyleBadgeProps {
  label: string;
  type?: 'minimalist' | 'classic' | 'streetwear' | 'luxury' | 'cyberpunk' | 'traditional' | 'casual' | 'formal' | 'neutral';
  id?: string;
}

export const StyleBadge: React.FC<StyleBadgeProps> = ({ label, type = 'neutral', id }) => {
  const getThemeColors = () => {
    switch (type) {
      case 'minimalist':
        return 'bg-zinc-100 text-zinc-800 border-zinc-200/60 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800/60';
      case 'classic':
        return 'bg-blue-50 text-blue-800 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/30';
      case 'streetwear':
        return 'bg-amber-50 text-amber-805 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30';
      case 'luxury':
        return 'bg-purple-50 text-purple-800 border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/30';
      case 'cyberpunk':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200/50 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/30';
      case 'traditional':
        return 'bg-orange-50 text-orange-800 border-orange-200/50 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/30';
      case 'casual':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30';
      case 'formal':
        return 'bg-zinc-900 text-zinc-100 border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200';
      default:
        return 'bg-white/[0.03] text-white/60 border-white/5';
    }
  };

  return (
    <span
      id={id || `style-badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider border rounded transition-all duration-300 ${getThemeColors()}`}
    >
      {label}
    </span>
  );
};
