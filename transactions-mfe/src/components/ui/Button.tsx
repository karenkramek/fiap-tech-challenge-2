import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'active' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm';

  const variantClasses = {
    active: 'bg-tertiary-600 text-white-50 hover:bg-tertiary-700 focus:ring-tertiary-300 rounded-lg',
    primary: 'bg-primary-700 text-white-50 hover:bg-primary-800 focus:ring-primary-300 rounded-lg',
    secondary: 'bg-white-600 text-black-400 hover:bg-white-700 focus:ring-white-800 rounded-lg border border-white-700',
    danger: 'bg-error-700 text-white-50 hover:bg-error-800 focus:ring-error-300 rounded-lg',
    success: 'bg-success-700 text-white-50 hover:bg-success-800 focus:ring-success-300 rounded-lg',
    warning: 'bg-warning-700 text-white-50 hover:bg-warning-800 focus:ring-warning-300 rounded-lg',
    info: 'bg-info-700 text-white-50 hover:bg-info-800 focus:ring-info-300 rounded-lg',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = isFullWidth ? 'w-full' : '';

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
