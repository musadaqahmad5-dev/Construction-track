/**
 * ARIA v2.5 Agent Status Badge Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { AgentStatusType } from '../../aria/agents/AgentTypes';
import { Activity, CheckCircle2, AlertCircle, PauseCircle, Clock } from 'lucide-react';

interface AgentStatusBadgeProps {
  status: AgentStatusType;
  className?: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  status,
  className = ''
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'EXECUTING':
        return {
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]',
          icon: Activity,
          label: 'Executing'
        };
      case 'SUCCESS':
        return {
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
          icon: CheckCircle2,
          label: 'Active / Success'
        };
      case 'FAILED':
        return {
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
          icon: AlertCircle,
          label: 'Failed'
        };
      case 'PAUSED':
        return {
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: PauseCircle,
          label: 'Paused'
        };
      default:
        return {
          color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
          icon: Clock,
          label: 'Idle / Ready'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${config.color} ${className}`}>
      <Icon className={`w-3 h-3 ${status === 'EXECUTING' ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
