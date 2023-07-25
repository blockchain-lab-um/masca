import { Fragment, useEffect, useState } from 'react';
import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { useTableStore } from '@/stores';

type DataStoreComboboxProps = {
  isConnected: boolean;
  vcs: QueryCredentialsRequestResult[];
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
  const dataStores = [...new Set(dataStoresFull)];

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
            <div className="md:w-34 relative flex h-[37px] w-28 cursor-default overflow-hidden rounded-full shadow-md sm:text-sm md:h-[43px]">
              <Combobox.Input
                className={`md:text-md dark:bg-navy-blue-700 dark:text-navy-blue-50 w-full truncate py-2.5 pl-5 text-sm text-gray-700 focus:outline-none md:py-3 ${
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
              <Combobox.Button className="dark:bg-navy-blue-700 bg-white pr-2">
                <>
                  <ChevronDownIcon
                    className={`animated-transition dark:text-navy-blue-50 h-3 w-3 text-gray-700 md:h-4 md:w-4 lg:h-5 lg:w-5 ${
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
              <Combobox.Options className="dark:bg-navy-blue-600 absolute left-0 z-50 mt-1 w-36 rounded-3xl bg-white p-0.5 text-center shadow-lg md:right-0 md:w-48 md:p-1">
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
                          'text-md block rounded-full py-2 md:text-lg'
                        )}
                      >
                        <span className="grid grid-cols-3 items-center">
                          <span>
                            {selected ? (
                              <CheckIcon className="ml-3 h-4 w-4 md:h-5 md:w-5" />
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
