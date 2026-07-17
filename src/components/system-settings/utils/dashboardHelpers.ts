/**
 * Map status to color classes for cards and buttons
 */
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'OPTIMIZED':
    case 'HEALTHY':
    case 'SUCCESS':
    case 'ACTIVE':
    case 'CONGRUENT':
      return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/10';
    case 'FUNCTIONAL':
    case 'NOMINAL':
    case 'LEARNING':
    case 'ANALYZING':
    case 'RECOVERED':
      return 'text-indigo-400 bg-indigo-950/20 border-indigo-500/10';
    case 'WARNING':
    case 'SUSPENDED':
    case 'BETA':
      return 'text-amber-400 bg-amber-950/20 border-amber-500/10';
    case 'BLOCKED':
    case 'CRITICAL':
    case 'ERROR':
    case 'VIOLATION':
      return 'text-rose-400 bg-rose-950/20 border-rose-500/10';
    default:
      return 'text-zinc-400 bg-zinc-950/20 border-zinc-500/10';
  }
}
