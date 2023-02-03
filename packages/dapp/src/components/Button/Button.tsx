import React from 'react';
import { clsx } from 'clsx';

type ButtonProps = {
  variant:
    | 'primary'
    | 'primary-active'
    | 'secondary-active'
    | 'secondary'
    | 'connect';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wd';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  onClick?: () => void;
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
};

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white rounded-full animated-transition',
  'primary-active':
    'text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 animated-transition rounded-full',
  secondary:
    'bg-navy-blue-500 text-white btn hover:opacity-80  rounded-full animated-transition',
  'secondary-active':
    'text-navy-blue-500 outline outline-navy-blue-500 hover:text-white hover:bg-navy-blue-500 animated-transition rounded-full',
  connect:
    'bg-orange-100 text-orange-500 hover:opacity-80  rounded-full animated-transition',
};

const sizes: Record<string, string> = {
  sm: 'text-h5 py-2 px-5 max-w-xs',
  md: 'text-h4 py-2 px-7 max-w-xs',
  lg: 'text-2xl py-2.5 px-8 font-semibold max-w-xs',
  xl: 'text-h3 py-3 px-9 font-semibold max-w-xs',
  wd: 'text-h4 py-3 px-7 max-w-xs',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  shadow = '',
  id,
  onClick,
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <div className="bg-gray-100 max-w-xs rounded-full">
      <button
        className={`${clsx(
          variants[variant],
          sizes[size],
          `shadow-${shadow}`
        )}`}
        onClick={onClick}
        id={id}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
