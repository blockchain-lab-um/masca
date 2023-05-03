import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { DropdownMenuItem } from './DropdownMenuItem';

interface DropdownMenuProps {
  items: string[];
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
  xs: 'text-sm py-1 px-3 max-w-xs',
  sm: 'text-md py-1.5 px-3.5 max-w-xs',
  md: 'text-lg py-2 px-4 max-w-xs',
  lg: 'text-2xl py-2.5 px-5 font-semibold max-w-xs',
  method:
    'text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin focus:outline-none',
};

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white animated-transition ',
  secondary:
    'bg-navy-blue-500 text-white btn hover:opacity-80   animated-transition ',
  'primary-active':
    'text-gray-700 dark:text-navy-blue-300 border border-2 border-gray-300 animated-transition font-semibold ',
  'secondary-active':
    'text-navy-blue-500 border border-1 border-navy-blue-300 animated-transition ',
  gray: 'bg-gray-200 text-gray-800 btn hover:opacity-80 animated-transition ',
  method:
    'dark:text-navy-blue-400 text-gray-600 dark:hover:bg-navy-blue-800 hover:bg-orange-100/50',
};

const variantsHover: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white animated-transition ',
  secondary: 'bg-navy-blue-500 text-white btn hover:opacity-80 ',
  'primary-active': ' ',
  'secondary-active': ' ',
  gray: 'opacity-80',
  method: 'dark:bg-navy-blue-800 bg-orange-100/50',
};
export default function DropdownMenu({
  items,
  selected,
  setSelected,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  shadow = 'sm',
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative z-10">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
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
              {selected}

              <ChevronDownIcon
                className={`animated-transition -mr-1 ml-2 h-5 w-5 ${
                  open ? 'rotate-180 transform' : ''
                }`}
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="dark:bg-navy-blue-500 absolute right-0 mt-1 w-48 rounded-3xl bg-white shadow-lg focus:outline-none">
              <div className="p-1">
                {items.map((item, id) => {
                  return (
                    <DropdownMenuItem
                      selected={item === selected}
                      handleBtn={setSelected}
                      key={id}
                      variant={variant}
                    >
                      {item}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
}
