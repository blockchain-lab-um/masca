import { Menu } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
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
}: DropdownButtonProps) => (
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
            ? 'dark:bg-navy-blue-400 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600 '
            : '',
          selected
            ? 'dark:text-orange-accent-dark dark:bg-navy-blue-500 dark:hover:bg-navy-blue-500 bg-white text-pink-700'
            : 'dark:text-navy-blue-50 text-gray-600',
          'block rounded-full py-2 text-lg'
        )}
      >
        <span className="grid grid-cols-3">
          <span>{selected ? <CheckIcon className="ml-3 h-5 w-5" /> : ''}</span>
          {children}
        </span>
      </a>
    )}
  </Menu.Item>
);
