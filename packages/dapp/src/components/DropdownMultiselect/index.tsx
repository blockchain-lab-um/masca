import type { AvailableCredentialStores } from '@blockchain-lab-um/masca-connector';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment } from 'react';

interface DropdownMultiselectProps {
  items: string[];
  selectedItems: AvailableCredentialStores[];
  setSelectedItems: (items: AvailableCredentialStores[]) => void;
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
  <div className="relative flex flex-1 justify-end">
    <Listbox
      value={selectedItems}
      onChange={setSelectedItems}
      name={name}
      multiple
    >
      {({ open }) => (
        <div className="md:text-md overflow-hidden rounded-full text-left text-sm shadow-md">
          <Listbox.Button
            value={placeholder}
            className="dark:bg-navy-blue-700 dark:text-navy-blue-100 flex w-full rounded-full border-2 border-pink-500 bg-white p-1 px-1 text-sm leading-5 text-pink-500 placeholder:text-gray-400"
          >
            <div
              className={clsx(
                'animated-transition flex flex-1 items-center justify-center gap-x-1 pl-4',
                selectedItems.length === 0
                  ? 'dark:text-navy-blue-200 text-pink-500 '
                  : null
              )}
            >
              {selectedItems.map((item, i) => (
                <span key={item}>
                  {item}
                  {i !== 0 && i !== selectedItems.length - 1 ? ', ' : null}
                </span>
              ))}
              {selectedItems.length === 0 && placeholder}
            </div>
            <div className="px-2">
              <ChevronDownIcon
                className={clsx(
                  'animated-transition dark:text-navy-blue-100 h-5 w-5 text-pink-500',
                  open ? 'rotate-180' : null
                )}
              />
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="dark:bg-navy-blue-600 absolute right-0 z-50 mt-1 w-36 rounded-3xl bg-white p-1 shadow-lg max-md:-top-2 max-md:-translate-y-full md:w-44">
              {items.map((item) => (
                <Listbox.Option key={item} className="" value={item}>
                  {({ selected, active }) => (
                    <>
                      <span
                        className={clsx(
                          active
                            ? 'dark:bg-navy-blue-500 dark:text-orange-accent-dark/95 animated-transition cursor-pointer bg-pink-50 text-pink-600'
                            : null,
                          selected
                            ? 'dark:text-orange-accent-dark dark:bg-navy-blue-600 bg-white text-pink-700'
                            : 'dark:text-navy-blue-100 text-gray-600',
                          'md:text-md block rounded-full py-2 text-center text-sm'
                        )}
                      >
                        <span className="grid grid-cols-3">
                          <span className="flex items-center">
                            {selected ? (
                              <CheckIcon className="ml-3 h-3 w-3 md:h-4 md:w-4" />
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
