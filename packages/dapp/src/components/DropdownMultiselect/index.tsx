import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

interface DropdownMultiselectProps {
  items: string[];
  initialSelectedItems?: string[];
  placeholder?: string;
  name?: string;
}

const DropdownMultiselect = ({
  items,
  initialSelectedItems = [],
  placeholder = '',
  name = '',
}: DropdownMultiselectProps) => {
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelectedItems);
  return (
    <div className="relative">
      <Listbox
        value={selectedItems}
        onChange={setSelectedItems}
        name={name}
        multiple
      >
        {({ open }) => (
          <div className="w-24 cursor-default rounded-full overflow-hidden focus:outline-none bg-white text-left  sm:text-sm border border-gray-200 shadow-md">
            <Listbox.Button
              value={placeholder}
              className="w-full px-1 flex placeholder:text-orange-200 border-none p-1 text-sm leading-5 focus:outline-none dark:bg-gray-800 text-orange-500 focus:ring-0"
            >
              <div
                className={`w-3/4 truncate ${
                  selectedItems.length === 0 ? 'text-orange-200' : ''
                }`}
              >
                {selectedItems.map((item) => item).join(', ')}
                {selectedItems.length === 0 && <>{placeholder}</>}
              </div>
              <div>
                {open ? (
                  <>
                    <ChevronUpIcon className={`h-5 w-5 text-orange-500`} />
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className={`h-5 w-5 text-orange-500`} />
                  </>
                )}
              </div>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-0 mt-1 max-h-60 z-50 w-fit shadow-md rounded-xl bg-white py-1 text-base border border-gray-200 sm:text-sm">
                {items.map((item, id) => (
                  <Listbox.Option
                    key={id}
                    className={({ active }) =>
                      `relative mx-2 rounded-xl pl-10 pr-4 py-2 text-sm ${
                        active
                          ? 'text-orange-700 bg-orange-100 animated-transition cursor-pointer'
                          : 'text-gray-800'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-semibold' : 'font-normal'
                          }`}
                        >
                          {item}
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
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default DropdownMultiselect;
