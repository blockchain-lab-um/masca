import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { Popover, Transition } from '@headlessui/react';
import React from 'react';

type AddressPopoverProps = {
  address: string;
  did: string;
  disconnect: () => void;
};

export const AddressPopover = ({
  address,
  did,
  disconnect,
}: AddressPopoverProps) => {
  return (
    <Popover className="relative z-50">
      {({ open }) => (
        <>
          <Popover.Button
            className={`inline-flex w-full  justify-center bg-purple-50 text-purple-800 px-4 py-2 text-h4 rounded-3xl animated-transition font-medium hover:bg-purple-100 focus:outline-none ${
              open ? 'bg-purple-100' : ''
            }`}
          >
            <div className="flex">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
              {open ? (
                <>
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 md:hidden" />
                  <ChevronUpIcon className="-mr-1 ml-2 h-5 w-5 hidden md:block" />
                </>
              ) : (
                <>
                  <ChevronUpIcon className="-mr-1 ml-2 h-5 w-5 md:hidden" />
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 hidden md:block" />
                </>
              )}
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
            <Popover.Panel className="absolute max-md:left-0 max-md:-top-12 max-md:transform max-md:-translate-y-full max-md:mb-2 md:mt-2 right-0 bg-white shadow-sm h-42 w-72 p-4 rounded-2xl border border-navy-blue-100">
              <div className="flex flex-col justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-700">DID</div>
                  <div className="flex items-center">
                    <div className=" text-2xl text-gray-900">{`${did.slice(
                      0,
                      12
                    )}...${did.slice(-8)}`}</div>
                    <button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        navigator.clipboard.writeText(did);
                      }}
                    >
                      <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 hover:text-gray-600 animated-transition" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className=" text-sm text-gray-700">
                    CONNECTED WITH METAMASK
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 mt-0.5">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div className=" text-lg text-gray-900 ">{`${address.slice(
                      0,
                      8
                    )}...${address.slice(-6)}`}</div>
                    <button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        navigator.clipboard.writeText(address);
                      }}
                    >
                      <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 hover:text-gray-600 animated-transition" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex justify-start">
                  <button
                    onClick={disconnect}
                    className="mt-auto text-sm text-pink-800  font-semibold  hover:text-pink-700 animated-transition"
                  >
                    DISCONNECT
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
    // <Button variant="primary" onClick={() => {}}>
    //   <div className="flex">
    //     {`${address.slice(0, 6)}...${address.slice(-4)}`}
    //     <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
    //   </div>
    // </Button>
  );
};
