import React from 'react';
import { Menu } from '@headlessui/react';
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
  'primary-active': 'bg-orange-100 text-orange-700 ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 ',
  gray: 'bg-gray-100 text-gray-800 ',
};

const variantsSelected: Record<string, string> = {
  primary: 'bg-orange-100 text-orange-700 font-semibold ',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 font-semibold ',
  'primary-active': 'bg-orange-100 text-orange-700 font-semibold ',
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
            'mx-2 block rounded-xl px-4 py-2 text-sm',
            active ? variants[variant] : '',
            selected ? variantsSelected[variant] : 'font-normal'
          )}
        >
          <span className="flex">{children}</span>
        </a>
      )}
    </Menu.Item>
  );
};
