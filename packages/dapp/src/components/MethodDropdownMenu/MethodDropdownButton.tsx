import { CheckIcon } from '@heroicons/react/24/solid';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { useState } from 'react';

interface DropdownButtonProps {
  children: React.ReactNode;
  handleBtn: (text: string) => Promise<void>;
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

export function DropdownButton({
  children,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  return (
    <DropdownMenuItem>
      <button
        type="button"
        className={clsx(
          'md:text-md block w-full rounded-full py-2 px-1 text-sm',
          isActive ? variants[variant] : null,
          selected ? variantsSelected[variant] : variantsSelectedElse[variant]
        )}
        onClick={() => handleBtn(children as string)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-8 items-center px-1">
          <span className="col-span-6 flex justify-start items-center">
            {children === 'did:key:jwk_jcs-pub' ? 'did:key (EBSI)' : children}
          </span>
          <span className="col-span-2">
            {selected && <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />}
          </span>
        </div>
      </button>
    </DropdownMenuItem>
  );
}
