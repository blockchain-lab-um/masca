'use client';

import type { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect } from 'react';

import { useTableStore } from '@/stores';
import { CredentialTypes } from './CredentialTypes';
import { DataStores } from './DataStores';
import { Ecosystems } from './Ecosystems';

interface FilterPopoverProps {
  vcs: QueryCredentialsRequestResult[];
}

function FilterPopover({ vcs }: FilterPopoverProps) {
  const t = useTranslations('FilterPopover');

  const setCredentialTypes = useTableStore((state) => state.setCredentialTypes);

  const getAvailableCredentialTypes = () => {
    const allCredentialTypes: string[] = [];
    vcs.forEach((vc) => {
      if (!vc.data.type) return;
      if (typeof vc.data.type === 'string') {
        allCredentialTypes.push(vc.data.type);
        return;
      }
      vc.data.type.forEach((type: string) => {
        if (type !== 'VerifiableCredential') allCredentialTypes.push(type);
      });
    });
    const availableCredentialTypes = [...new Set(allCredentialTypes)];

    setCredentialTypes(
      availableCredentialTypes.map((type) => ({
        type,
        selected: true,
      }))
    );
  };

  useEffect(() => {
    getAvailableCredentialTypes();
  }, [vcs]);

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <div className="dark:bg-navy-blue-700 flex h-full items-center rounded-full bg-white shadow-md">
            <Popover.Button
              className={clsx(' flex items-center px-4 text-xl ')}
            >
              <span>{t('filters')}</span>
              <ChevronDownIcon
                className={`animated-transition ml-1 h-5 w-5 ${
                  open ? ' rotate-180 ' : ' '
                }
              `}
                aria-hidden="true"
              />
            </Popover.Button>
          </div>
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
              <div className="dark:bg-navy-blue-600 rounded-xl bg-white py-2 shadow-md">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="font-ubuntu dark:text-navy-blue-50 text-lg font-semibold text-gray-800">
                    {t('filter')}
                  </div>
                  <button type="button" className="hidden text-red-500">
                    {t('clear')}
                  </button>
                </div>
                <DataStores />
                <CredentialTypes />
                <Ecosystems />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default FilterPopover;
