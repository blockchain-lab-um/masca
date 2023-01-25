import React from 'react';
import { Menu } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const DropdownButton = ({ text, handleBtn }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          onClick={() => {
            handleBtn(text);
          }}
          className={classNames(
            active
              ? 'bg-gray-100 text-orange bg-orange-20 animated-transition'
              : 'text-gray-80',
            'block px-4 mx-2 rounded-xl py-2 text-sm'
          )}
        >
          {text}
        </a>
      )}
    </Menu.Item>
  );
};
