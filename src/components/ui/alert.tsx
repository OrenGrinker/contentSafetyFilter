import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'default', className = '', children }: AlertProps) {
  const baseClasses = 'p-4 rounded-lg border';
  const variantClasses = variant === 'destructive' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200';
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h5 className="font-medium mb-1">{children}</h5>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm opacity-90">{children}</div>;
}