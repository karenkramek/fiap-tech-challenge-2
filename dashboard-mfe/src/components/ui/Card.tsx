import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const baseClasses = 'rounded-lg shadow-md p-6';

  const variantClasses = {
    default: 'bg-white-50 text-black-400',
    dark: 'bg-primary-700 text-white-50'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
