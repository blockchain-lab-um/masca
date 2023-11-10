'use client';

import { Fragment, useEffect, useState } from 'react';
import {
  AvailableCredentialStores,
  QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { useGeneralStore, useTableStore } from '@/stores';
import { CredentialTypes } from './CredentialTypes';
import { DataStores } from './DataStores';

interface FilterPopoverProps {
  vcs: QueryCredentialsRequestResult[];
}

function FilterPopover({ vcs }: FilterPopoverProps) {
  const t = useTranslations('AppNavbar');
  const [storesOpen, setStoresOpen] = useState(false);

  const {
    dataStores,
    availableEcosystems,
    selectedEcosystems,
    credentialTypes,
    columnFilters,
    setColumnFilters,
    setDataStores,
    setAvailableEcosystems,
    setSelectedEcosystems,
    setCredentialTypes,
  } = useTableStore((state) => ({
    dataStores: state.dataStores,
    availableEcosystems: state.availableEcosystems,
    selectedEcosystems: state.selectedEcosystems,
    credentialTypes: state.credentialTypes,
    columnFilters: state.columnFilters,
    setDataStores: state.setDataStores,
    setAvailableEcosystems: state.setAvailableEcosystems,
    setSelectedEcosystems: state.setSelectedEcosystems,
    setCredentialTypes: state.setCredentialTypes,
    setColumnFilters: state.setColumnFilters,
  }));

  const isConnected = useGeneralStore((state) => state.isConnected);

  const updateColumnFiltersDataStore = () => {
    const dsFilter = {
      id: 'data_store',
      value: [] as AvailableCredentialStores[],
    };
    dsFilter.value = dataStores
      .filter((ds) => ds.selected)
      .map((ds) => ds.dataStore);

    const newColumnFilters = columnFilters.filter(
      (cf) => cf.id !== 'data_store'
    );
    newColumnFilters.push(dsFilter);
    console.log('newColumnFilters', newColumnFilters);
    setColumnFilters(newColumnFilters);
  };

  const updateColumnFiltersCredentialTypes = () => {
    const typeFilter = {
      id: 'type',
      value: [] as string[],
    };
    typeFilter.value = credentialTypes
      .filter((type) => type.selected)
      .map((type) => type.type);

    const newColumnFilters = columnFilters.filter((cf) => cf.id !== 'type');
    newColumnFilters.push(typeFilter);
    console.log('newColumnFilters', newColumnFilters);
    setColumnFilters(newColumnFilters);
  };

  const getAvailableCredentialTypes = () => {
    const allCredentialTypes: string[] = [];
    vcs.forEach((vc) => {
      if (vc.data.type) {
        if (typeof vc.data.type === 'string') {
          allCredentialTypes.push(vc.data.type);
          return;
        }
        vc.data.type.forEach((type: string) => {
          if (type !== 'VerifiableCredential') allCredentialTypes.push(type);
        });
      }
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
    updateColumnFiltersDataStore();
  }, [dataStores]);

  useEffect(() => {
    getAvailableCredentialTypes();
  }, [vcs]);

  useEffect(() => {
    updateColumnFiltersCredentialTypes();
  }, [credentialTypes]);

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
              <div className="rounded-xl bg-white py-2 shadow-md">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="font-ubuntu text-lg font-semibold text-gray-700">
                    Filters
                  </div>
                  <button className="text-red-500">clear</button>
                </div>
                <DataStores />
                <CredentialTypes />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default FilterPopover;
