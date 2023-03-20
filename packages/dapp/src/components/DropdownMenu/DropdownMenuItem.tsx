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
    | 'gray';
};

const variants: Record<string, string> = {
  primary: 'bg-orange-100 text-orange-700 ',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 ',
  'primary-active':
    'dark:bg-navy-blue-400 dark:text-orange-accent-dark animated-transition cursor-pointer bg-pink-50 text-pink-600  ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 ',
  gray: 'bg-gray-100 text-gray-800 ',
};

const variantsSelected: Record<string, string> = {
  primary: 'bg-orange-100 text-orange-700 font-semibold ',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 font-semibold ',
  'primary-active':
    'dark:text-orange-accent-dark dark:bg-navy-blue-500 bg-white text-pink-700 ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 font-semibold ',
  gray: 'bg-gray-100 font-semibold text-gray-900 ',
};

export const DropdownMenuItem = ({
  children,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownMenuItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          onClick={() => {
            handleBtn(children as string);
          }}
          className={clsx(
            'text-md block rounded-full py-2 text-center',
            active ? variants[variant] : '',
            selected
              ? variantsSelected[variant]
              : 'dark:text-navy-blue-50 font-normal'
          )}
        >
          <div className="grid grid-cols-5 px-5">
            <span>
              {selected ? <CheckIcon className="ml-3 h-5 w-5" /> : ''}
            </span>
            <span className=" col-span-4 col-start-2 text-center">
              {children}
            </span>
          </div>
        </a>
      )}
    </Menu.Item>
  );
};
