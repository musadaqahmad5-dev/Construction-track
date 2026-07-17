import React, { ReactNode } from 'react';

interface StatGridProps {
  cols?: number; // 2, 3, 4, 5
  gap?: string;
  className?: string;
  children: ReactNode;
}

export const StatGrid: React.FC<StatGridProps> = ({
  cols = 3,
  gap = 'gap-4',
  className = '',
  children
}) => {
  const colClass = 
    cols === 2 ? 'grid-cols-2' : 
    cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 
    cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 
    cols === 5 ? 'grid-cols-2 lg:grid-cols-5' : 
    'grid-cols-1 md:grid-cols-3';

  return (
    <div className={`grid ${colClass} ${gap} ${className}`}>
      {children}
    </div>
  );
};
