import React, { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import { useTableStore } from '../../../utils/store';

const dataStores = ['snap', 'ceramic', 'test'];

export const DataStoreCombobox = () => {
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

  const filteredDataStores =
    query === ''
      ? dataStores
      : dataStores.filter((ds) => {
          return ds.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="w-36">
      <Combobox
        value={selectedItems}
        onChange={(value) => {
          setColumnFilters([{ id: 'data_store', value }]);
        }}
        multiple
      >
        {({ open }) => (
          <div className="relative">
            <div className="relative  w-full cursor-default rounded-full overflow-hidden focus:outline-none bg-whitetext-left shadow-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
              <Combobox.Input
                className="w-full placeholder:text-orange-200 border-none py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none dark:bg-gray-800 text-orange-500 focus:ring-0"
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
                    <ChevronUpIcon className="h-5 w-5 text-orange-500" />
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-5 w-5 text-orange-500" />
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
              <Combobox.Options className="absolute mt-1 max-h-60 z-50 w-full py-2 shadow-sm overflow-auto rounded-xl bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredDataStores.map((data_store, id) => (
                  <Combobox.Option
                    key={id}
                    className={({ active }) =>
                      `relative mx-2 rounded-xl pl-10 py-2 text-sm ${
                        active
                          ? 'text-orange-600 bg-orange-200 animated-transition cursor-pointer'
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
