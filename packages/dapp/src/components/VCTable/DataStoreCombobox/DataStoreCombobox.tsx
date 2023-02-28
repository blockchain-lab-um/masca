import React, { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { useTableStore } from '../../../utils/store';
import { VC_DATA } from '../data';

type DataStoreComboboxProps = {
  isConnected: boolean;
  vcs: QueryVCsRequestResult[];
};

export const DataStoreCombobox = ({
  vcs,
  isConnected,
}: DataStoreComboboxProps) => {
  const [query, setQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  const setColumnFilters = useTableStore((state) => state.setColumnFilters);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const selectedItems = useTableStore((state) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (let i = 0; i < state.columnFilters.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (state.columnFilters[i].id === 'data_store') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return state.columnFilters[i].value;
      }
    }
    return [];
  }) as string[];

  const dataStoresFull = VC_DATA.filter((vc) => vc.metadata.store !== undefined)
    .map((vc) => {
      return vc.metadata.store;
    })
    .flat() as string[];

  const dataStores = dataStoresFull.filter((element, index) => {
    return dataStoresFull.indexOf(element) === index;
  });
  console.log('ds', dataStores);

  const filteredDataStores =
    query === ''
      ? dataStores
      : dataStores.filter((ds) => {
          return ds.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="w-36 h-9">
      <Combobox
        value={selectedItems}
        onChange={(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          setColumnFilters([{ id: 'data_store', value }]);
        }}
        multiple
        disabled={!isConnected || vcs.length === 0}
      >
        {({ open }) => (
          <div className="h-full relative">
            <div className="relative h-full w-full cursor-default rounded-full overflow-hidden focus:outline-none bg-whitetext-left  sm:text-sm border border-gray-200 shadow-md">
              <Combobox.Input
                className={`w-full h-full placeholder:text-orange-200 border-none py-1.5 pl-3 pr-8 text-sm leading-5 focus:outline-none dark:bg-gray-800 text-orange-500 focus:ring-0 ${
                  !isConnected || vcs.length === 0
                    ? 'bg-gray-50 text-gray-300'
                    : ' '
                }`}
                displayValue={(value) => {
                  if (value === undefined) return '';
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
              <Combobox.Options className="absolute mt-1 max-h-60 z-50 w-full py-2 shadow-md rounded-xl bg-white text-base border border-gray-200 sm:text-sm">
                {filteredDataStores.map((data_store, id) => (
                  <Combobox.Option
                    key={id}
                    className={({ active }) =>
                      `relative mx-2 rounded-xl pl-10 py-2 text-sm ${
                        active
                          ? 'text-orange-700 bg-orange-100 animated-transition cursor-pointer'
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
                              active ? '' : 'text-orange-700'
                            }`}
                          >
                            <CheckIcon
                              className="h-5 w-5 text-orange-700"
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
