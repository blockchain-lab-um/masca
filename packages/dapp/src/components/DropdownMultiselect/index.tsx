import React, { Fragment } from 'react';
import { AvailableVCStores } from '@blockchain-lab-um/masca-types';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface DropdownMultiselectProps {
  items: string[];
  selectedItems: AvailableVCStores[];
  setSelectedItems: (items: AvailableVCStores[]) => void;
  placeholder?: string;
  name?: string;
}

const DropdownMultiselect = ({
  items,
  selectedItems,
  setSelectedItems,
  placeholder = '',
  name = '',
}: DropdownMultiselectProps) => (
  <div className="relative">
    <Listbox
      value={selectedItems}
      onChange={setSelectedItems}
      name={name}
      multiple
    >
      {({ open }) => (
        <div className="md:w-28 w-24 cursor-default overflow-hidden rounded-full bg-white text-left shadow-md focus:outline-none text-sm md:text-md">
          <Listbox.Button
            value={placeholder}
            className="dark:bg-navy-blue-600 dark:text-navy-blue-100 flex w-full border-none p-2 px-1 text-sm leading-5 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          >
            <div
              className={`w-3/4 truncate ${
                selectedItems.length === 0
                  ? 'dark:text-navy-blue-200 text-gray-400 '
                  : ''
              }`}
            >
              {selectedItems.map((item) => item).join(', ')}
              {selectedItems.length === 0 && <>{placeholder}</>}
            </div>
            <div>
              <>
                <ChevronDownIcon
                  className={`animated-transition dark:text-navy-blue-100 h-5 w-5 text-gray-700  ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="dark:bg-navy-blue-600 absolute right-0 mt-1 md:w-44 w-36 rounded-3xl bg-white p-1 shadow-lg max-md:-top-2 max-md:-translate-y-full max-md:transform">
              {items.map((item, id) => (
                <Listbox.Option key={id} className="" value={item}>
                  {({ selected, active }) => (
                    <>
                      <span
                        className={clsx(
                          active
                            ? 'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600 '
                            : '',
                          selected
                            ? 'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700'
                            : 'dark:text-navy-blue-100 text-gray-600',
                          'md:text-md block rounded-full text-center text-sm py-2'
                        )}
                      >
                        <span className="grid grid-cols-3">
                          <span className="flex items-center">
                            {selected ? (
                              <CheckIcon className="ml-3 md:h-4 md:w-4 w-3 h-3" />
                            ) : (
                              ''
                            )}
                          </span>
                          {item}
                        </span>
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  </div>
);

export default DropdownMultiselect;
