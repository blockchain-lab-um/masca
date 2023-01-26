import React from 'react';
import { Menu } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type DropdownButtonProps = {
  children: React.ReactNode;
  handleBtn: (text: string) => void;
};

export const DropdownButton = ({
  children,
  handleBtn,
}: DropdownButtonProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          onClick={() => {
            handleBtn(children as string);
          }}
          className={classNames(
            active
              ? 'bg-gray-100 text-orange bg-orange-20 animated-transition cursor-pointer'
              : 'text-gray-80',
            'block px-4 mx-2 rounded-xl py-2 text-sm'
          )}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  );
};
