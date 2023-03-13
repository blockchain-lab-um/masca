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
            className={`text-h4 animated-transition  inline-flex  w-full justify-center rounded-3xl px-4 py-2 font-medium text-pink-800 hover:bg-pink-100 focus:outline-none dark:text-orange-600 ${
              open
                ? 'bg-pink-100 dark:bg-purple-500'
                : 'bg-pink-50 dark:bg-purple-600 dark:hover:bg-purple-500'
            }`}
          >
            <div className="flex">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}

              <ChevronDownIcon
                className={`animated-transition -mr-1 ml-2 h-5 w-5 max-md:rotate-180 ${
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
            <Popover.Panel className="dark:bg-navy-blue-500 dark:border-navy-blue-400 absolute right-0 rounded-2xl bg-white shadow-xl dark:border max-md:left-0 max-md:-top-12 max-md:mb-2 max-md:-translate-y-full max-md:transform md:mt-2">
              <div className="rounded-2xl px-6 pt-6 pb-3 shadow-sm">
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <div className="dark:text-navy-blue-tone/80 text-sm text-gray-700">
                      DID
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className=" text-2xl text-gray-900 dark:text-white">{`${did.slice(
                        0,
                        12
                      )}...${did.slice(-8)}`}</div>
                      <button
                        onClick={() => {
                          copyToClipboard(did);
                        }}
                      >
                        <DocumentDuplicateIcon className="animated-transition ml-1 h-5 w-5 text-gray-900 hover:text-gray-600 dark:text-white" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className=" dark:text-navy-blue-tone/80 mt-4 text-sm text-gray-700">
                      CONNECTED WITH METAMASK
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-1 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
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
                        <DocumentDuplicateIcon className="animated-transition ml-1 h-5 w-5 text-gray-900 hover:text-gray-600 dark:text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-start">
                    <button
                      onClick={disconnect}
                      className="animated-transition mt-auto text-xs font-semibold text-pink-800 hover:text-pink-700 dark:text-pink-400 hover:dark:text-pink-500"
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
