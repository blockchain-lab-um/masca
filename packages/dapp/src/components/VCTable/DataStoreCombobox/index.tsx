import React, { Fragment, useState } from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { Combobox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

import { useTableStore } from '@/utils/stores';

type DataStoreComboboxProps = {
  isConnected: boolean;
  vcs: QueryVCsRequestResult[];
};

const DataStoreCombobox = ({ vcs, isConnected }: DataStoreComboboxProps) => {
  const [query, setQuery] = useState('');
  const setColumnFilters = useTableStore((state) => state.setColumnFilters);
  const selectedItems = useTableStore((state) => {
    for (let i = 0; i < state.columnFilters.length; i += 1) {
      if (state.columnFilters[i].id === 'data_store') {
        return state.columnFilters[i].value;
      }
    }
    return [];
  }) as string[];

  const dataStoresFull = vcs
    .filter((vc) => vc.metadata.store !== undefined)
    .map((vc) => {
      return vc.metadata.store;
    })
    .flat() as string[];

  const dataStores = dataStoresFull.filter((element, index) => {
    return dataStoresFull.indexOf(element) === index;
  });

  const filteredDataStores =
    query === ''
      ? dataStores
      : dataStores.filter((ds) => {
          return ds.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="h-9 w-36">
      <Combobox
        value={selectedItems}
        onChange={(value) => {
          setColumnFilters([{ id: 'data_store', value }]);
        }}
        multiple
        disabled={!isConnected || vcs.length === 0}
      >
        {({ open }) => (
          <div className="relative h-full">
            <div className="bg-whitetext-left relative h-full w-full cursor-default overflow-hidden rounded-full border  border-gray-200 shadow-md focus:outline-none sm:text-sm">
              <Combobox.Input
                className={`h-full w-full border-none py-1.5 pl-3 pr-8 text-sm leading-5 text-orange-500 placeholder:text-orange-200 focus:outline-none focus:ring-0 dark:bg-gray-800 ${
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
                {open ? (
                  <>
                    <ChevronUpIcon
                      className={`h-5 w-5 text-orange-500 ${
                        !isConnected || vcs.length === 0 ? 'text-gray-300' : ' '
                      }`}
                    />
                  </>
                ) : (
                  <>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-orange-500 ${
                        !isConnected || vcs.length === 0 ? 'text-gray-300' : ' '
                      }`}
                    />
                  </>
                )}
              </Combobox.Button>
            </div>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full rounded-xl border border-gray-200 bg-white py-2 text-base shadow-md sm:text-sm">
                {filteredDataStores.map((data_store, id) => (
                  <Combobox.Option
                    key={id}
                    className={({ active }) =>
                      `relative mx-2 rounded-xl py-2 pl-10 text-sm ${
                        active
                          ? 'animated-transition cursor-pointer bg-orange-100 text-orange-600'
                          : 'text-gray-800'
                      }`
                    }
                    value={data_store}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-semibold' : 'font-normal'
                          }`}
                        >
                          {data_store}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? '' : 'text-orange-500'
                            }`}
                          >
                            <CheckIcon
                              className="h-5 w-5 text-orange-500"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
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
