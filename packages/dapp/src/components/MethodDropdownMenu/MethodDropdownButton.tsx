import React from 'react';
import { Menu } from '@headlessui/react';
import { clsx } from 'clsx';

type DropdownButtonProps = {
  children: React.ReactNode;
  handleBtn: (text: string) => Promise<void>;
  selected: boolean;
};

export const DropdownButton = ({
  children,
  handleBtn,
  selected,
}: DropdownButtonProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          onClick={() => {
            handleBtn(children as string)
              .then(() => {})
              .catch(() => {});
          }}
          className={clsx(
            active
              ? 'bg-gray-100/60 dark:bg-navy-blue-400 dark:text-navy-blue-tone animated-transition cursor-pointer'
              : '',
            selected
              ? 'font-semibold text-gray-800 dark:text-navy-blue-tone dark:font-bold'
              : 'font-normal text-gray-600 dark:text-navy-blue-tone/80',
            'block px-4 mx-2 rounded-xl py-2 text-lg'
          )}
        >
          <span className="flex">{children}</span>
        </a>
      )}
    </Menu.Item>
  );
};
