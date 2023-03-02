import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
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
    | 'gray';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  setSelected: (selected: string) => void;
}

const sizes: Record<string, string> = {
  xs: 'text-h6 py-1 px-3 max-w-xs',
  sm: 'text-h5 py-1.5 px-3.5 max-w-xs',
  md: 'text-h4 py-2 px-4 max-w-xs',
  lg: 'text-2xl py-2.5 px-5 font-semibold max-w-xs',
};

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white  animated-transition ',
  secondary:
    'bg-navy-blue-500 text-white btn hover:opacity-80   animated-transition ',
  'primary-active':
    'text-orange-500 border border-1 border-gray-300 animated-transition ',
  'secondary-active':
    'text-navy-blue-500 border border-1 border-navy-blue-300  animated-transition ',
  gray: 'bg-gray-200 text-gray-800 btn hover:opacity-80 animated-transition ',
};

const variantsHover: Record<string, string> = {
  primary:
    'bg-gradient-to-b from-pink-500 to-orange-500 hover:bg-gradient-to-b hover:opacity-80 text-white  animated-transition ',
  secondary: 'bg-navy-blue-500 text-white btn hover:opacity-80 ',
  'primary-active': ' ',
  'secondary-active': ' ',
  gray: 'opacity-80',
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
                'flex justify-center items-center focus:outline-none animated-transition',
                variants[variant],
                sizes[size],
                `rounded-${rounded}`,
                `shadow-${shadow}`,
                'ring-none outline-none',
                open ? variantsHover[variant] : ''
              )}
            >
              {selected}
              {open ? (
                <>
                  <ChevronUpIcon
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  <ChevronDownIcon
                    className=" -mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </>
              )}
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
            <Menu.Items className="absolute mt-1 right-0 rounded-xl bg-white shadow-lg border border-gray-200 focus:outline-none">
              <div className="py-2">
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
