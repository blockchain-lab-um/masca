import React, { Fragment, useEffect, useState } from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { useTableStore } from '@/stores';

type DataStoreComboboxProps = {
  isConnected: boolean;
  vcs: QueryVCsRequestResult[];
};

const DataStoreCombobox = ({ vcs, isConnected }: DataStoreComboboxProps) => {
  const [query, setQuery] = useState('');
  const setColumnFilters = useTableStore((state) => state.setColumnFilters);

  // Get all data stores from vcs
  const dataStoresFull = vcs
    .filter((vc) => vc.metadata.store !== undefined)
    .map((vc) => vc.metadata.store)
    .flat() as string[];

  // Remove duplicates
  const dataStores = dataStoresFull.filter(
    (element, index) => dataStoresFull.indexOf(element) === index
  );

  const selectedItems = useTableStore((state) => {
    for (let i = 0; i < state.columnFilters.length; i += 1) {
      if (state.columnFilters[i].id === 'data_store') {
        return state.columnFilters[i].value;
      }
    }
    return [];
  }) as string[];

  useEffect(() => {
    // If there is only ceramic, select it (snap is selected by default)
    if (
      dataStores.length === 1 &&
      dataStores.includes('ceramic') &&
      !selectedItems.includes('ceramic')
    ) {
      setColumnFilters([{ id: 'data_store', value: ['ceramic'] }]);
      selectedItems.push('ceramic');
    }

    // inner join selectedItems and dataStores
    const filteredDataStores = dataStores.filter((ds) =>
      selectedItems.includes(ds)
    );
    setColumnFilters([{ id: 'data_store', value: filteredDataStores }]);
  }, [vcs]);

  // Search filter
  const filteredDataStores =
    query === ''
      ? dataStores
      : dataStores.filter((ds) =>
          ds.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="">
      <Combobox
        value={selectedItems}
        onChange={(value) => {
          setColumnFilters([{ id: 'data_store', value }]);
        }}
        multiple
        disabled={!isConnected || vcs.length === 0}
      >
        {({ open }) => (
          <div className="relative">
            <div className="md:w-34 w-24 md:h-[43px] h-[37px] relative cursor-default overflow-hidden rounded-full shadow-md sm:text-sm">
              <Combobox.Input
                className={`md:text-md text-sm dark:bg-navy-blue-700 dark:text-navy-blue-50 py-2.5 md:py-3 pl-5 text-gray-700 focus:outline-none ${
                  !isConnected || vcs.length === 0
                    ? 'bg-gray-50 text-gray-300'
                    : ' '
                }`}
                displayValue={(value: null | string | string[]) => {
                  if (value === undefined || value === null) return '';
                  if (typeof value === 'string') return value;
                  return value.join(', ');
                }}
                placeholder="None"
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <>
                  <ChevronDownIcon
                    className={`animated-transition dark:text-navy-blue-50 lg:h-5 lg:w-5 md:h-4 md:w-4 w-3 h-3 text-gray-700 ${
                      !isConnected || vcs.length === 0 ? 'text-gray-300' : ' '
                    } ${open ? 'rotate-180' : ''}`}
                  />
                </>
              </Combobox.Button>
            </div>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="dark:bg-navy-blue-600 absolute md:right-0 left-0 z-50 mt-1 md:w-48 w-36 rounded-3xl bg-white md:p-1 p-0.5 text-center shadow-lg">
                {filteredDataStores.map((data_store, id) => (
                  <Combobox.Option key={id} value={data_store}>
                    {({ selected, active }) => (
                      <span
                        className={clsx(
                          active
                            ? 'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600 '
                            : '',
                          selected
                            ? 'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700'
                            : 'dark:text-navy-blue-100 text-gray-600',
                          'block rounded-full py-2 md:text-lg text-md'
                        )}
                      >
                        <span className="grid grid-cols-3 items-center">
                          <span>
                            {selected ? (
                              <CheckIcon className="ml-3 md:h-5 md:w-5 h-4 w-4" />
                            ) : (
                              ''
                            )}
                          </span>
                          {data_store}
                        </span>
                      </span>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default DataStoreCombobox;
