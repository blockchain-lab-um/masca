import { Menu } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface DropdownMenuItemProps {
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
}

const variants: Record<string, string> = {
  primary:
    'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 ',
  'primary-active':
    'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600',
  gray: 'bg-gray-100 text-gray-800 ',
  method:
    'dark:bg-navy-blue-500 dark:text-orange-accent-dark animated-transition cursor-pointer bg-pink-50 text-pink-600',
};

const variantsSelected: Record<string, string> = {
  primary:
    'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 font-semibold',
  'primary-active':
    'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 font-semibold',
  gray: 'bg-gray-100 font-semibold text-gray-900',
  method:
    'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700',
};

const variantsSelectedElse: Record<string, string> = {
  primary: 'dark:text-navy-blue-100 text-gray-600',
  secondary: 'bg-navy-blue-100 text-navy-blue-600 font-semibold',
  'primary-active': 'dark:text-navy-blue-100 text-gray-600 ',
  'secondary-active': 'bg-navy-blue-100 text-navy-blue-600 font-semibold',
  gray: 'bg-gray-100 font-semibold text-gray-900',
  method: '',
};

export const DropdownMenuItem = ({
  children,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownMenuItemProps) => (
  <Menu.Item>
    {({ active }) => (
      <button
        type="button"
        onClick={() => {
          handleBtn(children as string);
        }}
        className={clsx(
          'md:text-md block rounded-full py-2 text-sm',
          active ? variants[variant] : '',
          selected ? variantsSelected[variant] : variantsSelectedElse[variant]
        )}
      >
        <div className="grid grid-cols-6">
          <span>
            {selected ? (
              <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />
            ) : (
              ''
            )}
          </span>
          <span className="col-span-4 col-start-2 text-center">{children}</span>
        </div>
      </button>
    )}
  </Menu.Item>
);
