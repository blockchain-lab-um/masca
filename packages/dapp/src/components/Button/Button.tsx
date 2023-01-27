import React from 'react';
import { clsx } from 'clsx';

type ButtonProps = {
  variant:
    | 'primary'
    | 'primary-active'
    | 'secondary-active'
    | 'secondary'
    | 'connect';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'lg' | '';
  onClick?: () => void;
  children: React.ReactNode;
  id?: string;
};

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-b to-pink from-orange hover:bg-gradient-to-b hover:opacity-80 text-white rounded-full animated-transition',
  'primary-active':
    'text-orange outline outline-orange hover:text-white hover:bg-orange animated-transition rounded-full',
  secondary:
    'bg-navy-blue text-white btn hover:opacity-80  rounded-full animated-transition',
  'secondary-active':
    'text-navy-blue outline outline-navy-blue hover:text-white hover:bg-navy-blue animated-transition rounded-full',
  connect:
    'bg-orange/30 text-orange hover:opacity-80  rounded-full animated-transition',
};

const sizes: Record<string, string> = {
  sm: 'text-h5 py-2 px-4 max-w-xs',
  md: 'text-h4 py-2 px-5 max-w-xs',
  lg: 'text-h3 py-[0.375em] px-6 font-semibold max-w-xs',
  xl: 'text-h3 py-[0.625em] px-8 font-semibold max-w-xs',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  shadow = '',
  id,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`${clsx(variants[variant], sizes[size], `shadow-${shadow}`)}`}
      onClick={onClick}
      id={id}
    >
      {children}
    </button>
  );
};

export default Button;
