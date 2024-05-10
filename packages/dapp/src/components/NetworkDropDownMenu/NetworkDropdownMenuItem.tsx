import { CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { Network } from '@/utils/networks';

import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from 'next-themes';

interface DropdownMenuItemProps {
  network: Network;
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
  network,
  handleBtn,
  selected,
  variant = 'primary',
}: DropdownMenuItemProps) {
  const { resolvedTheme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  const networkBackgroundColor =
    resolvedTheme === 'dark' ? '#ffffffbf' : network.backgroundColor;

  return (
    <DropdownMenuItem className="p-0">
      <button
        type="button"
        className={clsx(
          'md:text-md block w-full rounded-full py-2 text-sm',
          isActive ? variants[variant] : null,
          selected ? variantsSelected[variant] : variantsSelectedElse[variant]
        )}
        onClick={() => handleBtn(network.name as string)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-8 items-center">
          <span className="col-span-2 flex items-center justify-center">
            <Image
              src={network.logo}
              alt={`${network.name} logo`}
              style={{
                width: '50%',
                height: 'auto',
                backgroundColor: networkBackgroundColor,
                borderRadius: '25%',
              }}
              width={16}
              height={16}
            />
          </span>
          <span className="col-span-4 flex justify-start">
            <div className="text-left">{network.name}</div>
          </span>
          <span className="col-span-2">
            {selected && <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />}
          </span>
        </div>
      </button>
    </DropdownMenuItem>
  );
}
