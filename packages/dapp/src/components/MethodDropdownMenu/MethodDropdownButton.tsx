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
              ? 'dark:bg-navy-blue-400 dark:text-navy-blue-tone animated-transition cursor-pointer bg-gray-100/60'
              : '',
            selected
              ? 'dark:text-navy-blue-tone font-semibold text-gray-800 dark:font-bold'
              : 'dark:text-navy-blue-tone/80 font-normal text-gray-600',
            'mx-2 block rounded-xl px-4 py-2 text-lg'
          )}
        >
          <span className="flex">{children}</span>
        </a>
      )}
    </Menu.Item>
  );
};
