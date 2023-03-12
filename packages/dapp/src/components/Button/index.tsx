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
    | 'white'
    | 'white-pink';
  size?: 'popup' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'wd' | 'icon';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
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
  'white-pink':
    'bg-white text-gray-800 hover:text-white hover:bg-pink-400 rounded-full dark:bg-pink-300 dark:text-gray-800 dark:hover:bg-pink-200 dark:hover:text-pink-500 animated-transition',
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
  lg: 'text-2xl py-2 px-8 font-semibold max-w-xs',
  xl: 'text-h3 py-2.5 px-9 font-semibold max-w-xs',
  wd: 'text-h4 py-2.5 px-7 max-w-xs',
  icon: 'py-2 px-2 max-w-xs',
};

const loaderSizes: Record<string, string> = {
  popup: 'w-4 h-4 border-2',
  xs: 'w-4 h-4 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-4 h-4 border-2',
  lg: 'w-6 h-6 border-4',
  xl: 'w-8 h-6 border-4',
  wd: 'w-8 h-8 border-4',
  icon: 'w-4 h-4 border-2',
};

const loaderColors: Record<string, string> = {
  primary: 'border-white',
  'primary-active': 'border-orange-500',
  secondary: 'border-white',
  'secondary-active': 'border-navy-blue-500',
  connect: 'border-orange-500',
  gray: 'border-gray-800',
  white: 'border-orange-500',
  warning: 'border-white',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  shadow = '',
  id,
  onClick,
  children,
  disabled = false,
  loading = false,
}: ButtonProps) => {
  return (
    <div className="bg-gray-100 max-w-xs rounded-full">
      <button
        className={`${clsx(
          variants[variant],
          sizes[size],
          `shadow-${shadow}`,
          'flex items-center gap-x-2'
        )}`}
        onClick={onClick}
        id={id}
        disabled={disabled}
      >
        {children}{' '}
        {loading && (
          <div className="flex">
            <div
              className={clsx(
                loaderSizes[size],
                'border-solid animate-spin rounded-full border-t-pink-900/0',
                loaderColors[variant]
              )}
            ></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default Button;
