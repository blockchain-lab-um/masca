import React, { Fragment } from 'react';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

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
}: DropdownMultiselectProps) => {
  return (
    <div className="relative">
      <Listbox
        value={selectedItems}
        onChange={setSelectedItems}
        name={name}
        multiple
      >
        {({ open }) => (
          <div className="w-24 cursor-default overflow-hidden rounded-full border border-gray-200 bg-white  text-left shadow-md focus:outline-none sm:text-sm">
            <Listbox.Button
              value={placeholder}
              className="flex w-full border-none p-1 px-1 text-sm leading-5 text-orange-500 placeholder:text-orange-200 focus:outline-none focus:ring-0 dark:bg-gray-800"
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
              <Listbox.Options className="absolute left-0 z-50 mt-1 max-h-60 w-fit rounded-xl border border-gray-200 bg-white py-1 text-base shadow-md sm:text-sm">
                {items.map((item, id) => (
                  <Listbox.Option
                    key={id}
                    className={({ active }) =>
                      `relative mx-2 rounded-xl py-2 pl-10 pr-4 text-sm ${
                        active
                          ? 'animated-transition cursor-pointer bg-orange-100 text-orange-600'
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
