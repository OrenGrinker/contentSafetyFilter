import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}