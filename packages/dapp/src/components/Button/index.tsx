import React from 'react';
import { clsx } from 'clsx';

type ButtonProps = {
  variant:
    | 'primary'
    | 'primary-active'
    | 'secondary-active'
    | 'secondary'
    | 'connect'
    | 'gray'
    | 'warning'
    | 'white';
  size?: 'popup' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'wd' | 'icon';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
};

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white rounded-full animated-transition',
  'primary-active':
    'text-orange-500 border border-orange-500 bg-white hover:text-white hover:bg-orange-500 animated-transition rounded-full',
  secondary:
    'bg-navy-blue-500 text-white btn hover:opacity-80  rounded-full animated-transition',
  'secondary-active':
    'text-navy-blue-500 border border-navy-blue-500 hover:text-white hover:bg-navy-blue-500 animated-transition rounded-full',
  connect:
    'bg-orange-100 text-orange-500 hover:opacity-80  rounded-full animated-transition',
  gray: 'bg-gray-200 text-gray-800 hover:opacity-80  rounded-full animated-transition',
  white:
    'bg-white text-orange-500 border border-gray-200 hover:opacity-80  rounded-full animated-transition',
  warning:
    'bg-red-500 hover:bg-red-500/90 animated-transition text-white justify-center rounded-full',
};

const sizes: Record<string, string> = {
  popup: 'text-sm py-2 px-2.5 max-w-xs',
  xs: 'text-h5 py-2 px-3 max-w-xs',
  sm: 'text-h5 py-2 px-5 max-w-xs',
  md: 'text-h4 py-2 px-7 max-w-xs',
  lg: 'text-2xl py-2.5 px-8 font-semibold max-w-xs',
  xl: 'text-h3 py-3 px-9 font-semibold max-w-xs',
  wd: 'text-h4 py-3 px-7 max-w-xs',
  icon: 'py-2 px-2 max-w-xs',
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
