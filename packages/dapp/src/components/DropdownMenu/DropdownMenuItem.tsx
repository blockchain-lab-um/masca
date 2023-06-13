import React from 'react';
import { Menu } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

type DropdownMenuItemProps = {
  children: React.ReactNode;
  handleBtn: (text: string) => void;
  selected: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'primary-active'
    | 'secondary-active'
    | 'gray'
    | 'method';
};

const variants: Record<string, string> = {
  primary: 'bg-orange-100 text-orange-700 ',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 ',
  'primary-active':
    'dark:bg-navy-blue-400 dark:text-orange-accent-dark animated-transition cursor-pointer bg-pink-50 text-pink-600  ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 ',
  gray: 'bg-gray-100 text-gray-800 ',
  method:
    'dark:bg-navy-blue-400 dark:text-orange-accent-dark animated-transition cursor-pointer bg-pink-50 text-pink-600  ',
};

const variantsSelected: Record<string, string> = {
  primary: 'bg-orange-100 text-orange-700 font-semibold ',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 font-semibold ',
  'primary-active':
    'dark:text-orange-accent-dark dark:bg-navy-blue-500 bg-white text-pink-700 ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 font-semibold ',
  gray: 'bg-gray-100 font-semibold text-gray-900 ',
  method:
    'dark:text-orange-accent-dark dark:bg-navy-blue-500 bg-white text-pink-700 ',
};

export const DropdownMenuItem = ({
  children,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownMenuItemProps) => (
  <Menu.Item>
    {({ active }) => (
      <a
        onClick={() => {
          handleBtn(children as string);
        }}
        className={clsx(
          'md:text-md text-sm block rounded-full py-2',
          active ? variants[variant] : '',
          selected
            ? variantsSelected[variant]
            : 'dark:text-navy-blue-50 font-normal'
        )}
      >
        <div className="grid grid-cols-6">
          <span>{selected ? <CheckIcon className="ml-3 lg:h-5 lg:w-5 w-4 h-4" /> : ''}</span>
          <span className="col-span-4 col-start-2 text-center">
            {children}
          </span>
        </div>
      </a>
    )}
  </Menu.Item>
);
