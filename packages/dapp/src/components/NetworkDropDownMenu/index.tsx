'use client';

import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import clsx from 'clsx';
import NetworkDropdownMenuItem from './NetworkDropdownMenuItem';
import { TextSkeleton } from '../Skeletons/TextSkeleton';
import { ChevronDownIcon } from 'lucide-react';

import type { Network } from '@/utils/networks';

interface DropdownMenuProps {
  items: Network[];
  multiple?: boolean;
  selected: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'primary-active'
    | 'secondary-active'
    | 'gray'
    | 'method';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'method';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  setSelected: (selected: string) => void;
}

const sizes: Record<string, string> = {
  xs: 'md:text-sm md:py-1 md:px-3 text-sm py-1 px-2 max-w-xs',
  sm: 'md:text-md md:py-1.5 md:px-3.5 text-md font-medium py-1 px-3 max-w-xs',
  md: 'lg:text-lg lg:py-2 lg:px-4 md:text-md font-medium md:py-1.5 md:px-3.5 text-sm py-1 px-3 max-w-xs',
  lg: 'lg:text-2xl lg:py-2.5 lg:px-5 md:text-lg md:py-2 font-medium md:px-4 text-md py-1.5 px-3.5 max-w-xs font-semibold max-w-xs',
  method:
    'text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin focus:outline-none',
};

const variants: Record<string, string> = {
  primary:
    'bg-pink-500 dark:bg-orange-accent-dark hover:opacity-80 text-white dark:text-navy-blue-800 animated-transition ',
  secondary:
    'text-pink-500 border-[0.135rem] border-pink-500 dark:text-orange-accent-dark dark:border-orange-accent-dark animated-transition ',
  'primary-active':
    'text-pink-500 border-[0.135rem] border-pink-500 dark:text-orange-accent-dark dark:border-orange-accent-dark animated-transition ',
  'secondary-active':
    'text-navy-blue-500 border border-1 border-navy-blue-300 animated-transition ',
  gray: 'bg-gray-200 text-gray-800 btn hover:opacity-80 animated-transition ',
  method:
    'dark:text-navy-blue-400 text-gray-600 dark:hover:bg-navy-blue-800 hover:bg-orange-100/50',
};

const variantsHover: Record<string, string> = {
  primary: 'bg-pink-500 dark:bg-orange-accent-dark opacity-80',
  secondary: 'bg-navy-blue-500 text-white btn hover:opacity-80 ',
  'primary-active': ' ',
  'secondary-active': ' ',
  gray: 'opacity-80',
  method: 'dark:bg-navy-blue-800 bg-orange-100/50',
};

export default function NetworkDropDownMenu({
  items,
  selected,
  setSelected,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  shadow = 'sm',
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={() => setOpen(!open)}>
      <DropdownMenuTrigger
        className={clsx(
          'animated-transition flex items-center justify-center focus:outline-none',
          variants[variant],
          sizes[size],
          `rounded-${rounded}`,
          `shadow-${shadow}`,
          'ring-none outline-none',
          open ? variantsHover[variant] : ''
        )}
      >
        {selected || <TextSkeleton className="h-4 w-16" />}
        {selected && (
          <ChevronDownIcon
            className={`animated-transition -mr-1 ml-2 h-5 w-5 ${
              open ? 'rotate-180 ' : ''
            }`}
            aria-hidden="true"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-navy-blue-600 absolute right-0 mt-1 w-48 rounded-3xl bg-white shadow-lg focus:outline-none border-none">
        {items.map((item) => (
          <NetworkDropdownMenuItem
            key={item.name}
            children={item}
            selected={selected === item.name}
            handleBtn={setSelected}
            variant={variant}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
