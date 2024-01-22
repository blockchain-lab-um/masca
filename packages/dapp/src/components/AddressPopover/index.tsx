'use client';

import Image from 'next/image';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { normalize } from 'viem/ens';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import { copyToClipboard } from '@/utils/string';

interface AddressPopoverProps {
  did: string;
  disconnect: () => void;
}

const AddressPopover = ({ did, disconnect }: AddressPopoverProps) => {
  const t = useTranslations('AppNavbar');
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({
    name: normalize(ensName!) || undefined,
    gatewayUrls: {
      ipfs: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/',
    },
  });
  return (
    <Popover className="relative z-50">
      {({ open }) => (
        <>
          <Popover.Button
            className={clsx(
              'lg:text-h4 md:text-h5 animated-transition dark:bg-orange-accent-dark dark:text-navy-blue-900 font-ubuntu dark:hover:bg-orange-accent-dark/80 inline-flex w-full justify-center rounded-full border-none bg-pink-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-200/80 md:px-5 md:py-2.5 lg:px-7 lg:py-2.5',
              'outline-none focus-visible:outline-none',
              open ? 'dark:bg-orange-accent-dark/80 bg-pink-200/80' : ''
            )}
          >
            <div className="flex items-center justify-center">
              {avatar && (
                <Image
                  src={avatar}
                  width={24}
                  height={24}
                  alt="User's ENS pfp"
                  className="mr-2 inline-block rounded-full"
                />
              )}
              {ensName ?? `${address?.slice(0, 5)}...${address?.slice(-4)}`}

              <ChevronDownIcon
                className={`animated-transition -mr-1 ml-2 h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Popover.Panel className="dark:bg-navy-blue-600 absolute right-0 mt-2 rounded-2xl bg-white shadow-xl">
              <div className="rounded-2xl px-6 pb-3 pt-6 shadow-sm">
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <div className="dark:text-navy-blue-100 text-sm text-gray-700">
                      DID
                    </div>
                    <div className="mt-2 flex items-center">
                      <a
                        href={`https://dev.uniresolver.io/#${did}`}
                        target="_blank"
                        rel="noreferrer"
                        className="animated-transition cursor-pointer text-2xl text-gray-800 underline hover:text-gray-700 dark:text-white dark:hover:text-gray-100"
                      >{`${did.substring(0, did.lastIndexOf(':'))}:${did
                        .split(':')
                        [did.split(':').length - 1].slice(0, 5)}...${did.slice(
                        -4
                      )}`}</a>
                      <button
                        onClick={() => {
                          copyToClipboard(did);
                        }}
                      >
                        <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-50 ml-1 h-5 w-5 text-gray-800 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="dark:text-navy-blue-100 mt-4 text-sm text-gray-700">
                      {t('address.connected')}
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-1 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-lg text-gray-800 dark:text-white">{`${address?.slice(
                        0,
                        5
                      )}...${address?.slice(-4)}`}</div>
                      <button
                        onClick={() => {
                          copyToClipboard(address as string);
                        }}
                      >
                        <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-50 ml-1 h-5 w-5 text-gray-800 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-start">
                    <button
                      onClick={disconnect}
                      className="animated-transition mt-auto text-xs font-semibold text-red-500 hover:text-red-700 dark:text-red-300 hover:dark:text-red-500"
                    >
                      {t('address.disconnect')}
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
