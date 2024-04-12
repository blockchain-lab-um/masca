import { CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

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

export default function NetworkDropdownMenuItem({
  children,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem
      className={clsx(
        'md:text-md block w-full rounded-full py-2 text-sm',
        selected ? variantsSelected[variant] : variantsSelectedElse[variant]
      )}
      onClick={() => handleBtn(children as string)}
    >
      <div className="grid grid-cols-8">
        <span className="col-span-2">
          {/* TODO: Add network logos */}
          {selected && <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />}
        </span>
        <span className="col-span-4 flex justify-center">
          <div className="text-left">{children}</div>
        </span>
        <span className="col-span-2">
          {selected && <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
