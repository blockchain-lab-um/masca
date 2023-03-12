import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

import { copyToClipboard } from '@/utils/string';

type AddressPopoverProps = {
  address: string;
  did: string;
  disconnect: () => void;
};
const AddressPopover = ({ address, did, disconnect }: AddressPopoverProps) => {
  return (
    <Popover className="relative z-50">
      {({ open }) => (
        <>
          <Popover.Button
            className={`inline-flex w-full  justify-center  dark:text-orange-600 text-pink-800 px-4 py-2 text-h4 rounded-3xl animated-transition font-medium hover:bg-pink-100 focus:outline-none ${
              open
                ? 'bg-pink-100 dark:bg-purple-500'
                : 'bg-pink-50 dark:bg-purple-600 dark:hover:bg-purple-500'
            }`}
          >
            <div className="flex">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}

              <ChevronDownIcon
                className={`-mr-1 ml-2 h-5 w-5 max-md:rotate-180 animated-transition ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute max-md:left-0 max-md:-top-12 max-md:transform max-md:-translate-y-full max-md:mb-2 md:mt-2 right-0 bg-white dark:bg-navy-blue-500 dark:border dark:border-navy-blue-400 shadow-xl rounded-2xl">
              <div className="pt-6 px-6 pb-3 rounded-2xl shadow-sm">
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-700 dark:text-navy-blue-tone/80">
                      DID
                    </div>
                    <div className="flex items-center mt-2">
                      <div className=" text-2xl text-gray-900 dark:text-white">{`${did.slice(
                        0,
                        12
                      )}...${did.slice(-8)}`}</div>
                      <button
                        onClick={() => {
                          copyToClipboard(did);
                        }}
                      >
                        <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 dark:text-white hover:text-gray-600 animated-transition" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className=" text-sm text-gray-700 dark:text-navy-blue-tone/80 mt-4">
                      CONNECTED WITH METAMASK
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="mr-1 mt-0.5">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                      <div className=" text-lg text-gray-900 dark:text-white ">{`${address.slice(
                        0,
                        8
                      )}...${address.slice(-6)}`}</div>
                      <button
                        onClick={() => {
                          copyToClipboard(address);
                        }}
                      >
                        <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 dark:text-white hover:text-gray-600 animated-transition" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-start">
                    <button
                      onClick={disconnect}
                      className="mt-auto text-xs text-pink-800 dark:text-pink-400 hover:dark:text-pink-500 font-semibold hover:text-pink-700 animated-transition"
                    >
                      DISCONNECT
                    </button>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default AddressPopover;
