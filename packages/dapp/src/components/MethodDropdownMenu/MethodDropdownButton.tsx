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
              ? 'text-orange-600 bg-orange-100 animated-transition cursor-pointer'
              : 'text-gray-600',
            selected ? 'font-semibold text-orange-500' : 'font-normal',
            'block px-4 mx-2 rounded-xl py-2 text-lg'
          )}
        >
          <span className="flex">{children}</span>
        </a>
      )}
    </Menu.Item>
  );
};
