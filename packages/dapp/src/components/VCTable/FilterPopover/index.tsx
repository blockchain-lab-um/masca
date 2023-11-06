'use client';

import { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useGeneralStore } from '@/stores';

interface FilterPopoverProps {
    vcs: QueryCredentialsRequestResult[];
}


function FilterPopover({ vcs }: FilterPopoverProps) {
  const t = useTranslations('AppNavbar');
  const [storesOpen, setStoresOpen] = useState(false);

  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <Popover className="group relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={clsx(
              'nav-btn flex items-end',
              open
                ? 'dark:text-orange-accent-dark text-pink-500'
                : 'dark:text-navy-blue-400 text-gray-600'
            )}
          >
            <span>Filters</span>
            <ChevronDownIcon
              className={`animated-transition ml-1 h-5 w-5 ${
                open
                  ? 'dark:text-orange-accent-dark dark:group-hover:text-orange-accent-dark rotate-180 text-pink-500 group-hover:text-pink-500'
                  : 'dark:group-hover:text-orange-accent-dark dark:text-navy-blue-400 text-gray-600 group-hover:text-pink-500 '
              }
                  `}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 z-50 mt-3 w-screen max-w-[15rem]">
              <div className="bg-white shadow-md rounded-xl py-2">
                    <div className="flex justify-between items-center py-2 px-4">
                        <div className='text-gray-700 font-ubuntu font-semibold text-lg'>Filters</div>
                        <button className='text-red-500'>clear</button>
                    </div>
                    <div>
                        <button onClick={() => {setStoresOpen(!storesOpen)}}>
                            <div className='flex items-center'>
                               <ChevronRightIcon className={clsx('h-5 w-5 text-gray-700 animated-transition', `${storesOpen ? 'rotate-90' : '' }`)} /> 
                                Stores
                            </div>
                        </button>
                        {storesOpen && (
                            <div className='bg-pink-50'>
                            Content
                        </div>
                        )}
                    </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default FilterPopover;
