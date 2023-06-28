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
      <span
        onClick={() => {
          handleBtn(children as string)
            .then(() => {})
            .catch(() => {});
        }}
        className={clsx(
          active
            ? 'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600 '
            : '',
          selected
            ? 'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700'
            : 'dark:text-navy-blue-100 text-gray-600',
          'block rounded-full py-2 text-lg'
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
      </span>
    )}
  </Menu.Item>
);
