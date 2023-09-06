'use client';

import React from 'react';
import {
  CreditCardIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { useGeneralStore } from '@/stores';
import MascaLogo from '../MascaLogo';

interface ConnectedProviderProps {
  children: React.ReactNode;
}

const ConnectedProvider = ({ children }: ConnectedProviderProps) => {
  const t = useTranslations('ConnectedProvider');
  const isConnected = useGeneralStore((state) => state.isConnected);

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex-1 rounded-3xl bg-white shadow-lg">
      <div className="flex flex-col items-center p-12">
        <div className="text-h3 dark:text-navy-blue-50 text-gray-900">
          Connect Wallet & Install Masca to continue
        </div>
        <div className="dark:border-navy-blue-500 mt-8 rounded-3xl border border-gray-500 px-12 py-8 md:min-w-[40em]">
          <div className="flex items-center gap-x-6">
            <div className="hidden sm:block">
              <MascaLogo />
            </div>
            <div>
              <div className="text-h3 dark:text-navy-blue-50 font-ubuntu text-gray-900">
                Masca
              </div>
              <div className="text-h4 dark:text-navy-blue-300 font-ubuntu mt-2 text-gray-600">
                Manage Decentralized Identity in MetaMask
              </div>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="flex justify-center">
            <ul className="flex flex-col items-start text-justify text-xl tracking-normal">
              <li className="mt-12">
                <div className=" flex items-center gap-x-4">
                  <LockClosedIcon className="dark:text-orange-accent-dark h-8 w-8 text-pink-500" />
                  <div className="dark:text-navy-blue-50 font-ubuntu text-2xl font-medium text-gray-900 ">
                    Own your Identity
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-700">
                  Imagine your{' '}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    Ethereum account{' '}
                  </span>
                  as a passport in the digital world. With just a few clicks,
                  transform your existing account into a{' '}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    universal digital Identity
                  </span>
                  .
                </div>
              </li>
              <li className="mt-12">
                <div className=" flex items-center gap-x-4">
                  <CreditCardIcon className="dark:text-orange-accent-dark h-8 w-8 text-pink-500" />
                  <div className="dark:text-navy-blue-50 font-ubuntu text-2xl font-medium text-gray-900 ">
                    Manage Credentials securely
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-700">
                  Store everything from your Web3 community participation
                  certificate to your real world work credentials safely and
                  securely in one place. Choose to save them on{' '}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    Ceramic Network
                  </span>{' '}
                  or keep them privately in your
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {' '}
                    MetaMask wallet
                  </span>
                  .
                </div>
              </li>
              <li className="mt-12">
                <div className=" flex items-center gap-x-4">
                  <GlobeAltIcon className="dark:text-orange-accent-dark h-8 w-8 text-pink-500" />
                  <div className="dark:text-navy-blue-50 font-ubuntu max-w-[15em] text-start text-2xl font-medium text-gray-900 ">
                    Universal Compatibility with Identity Flows
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-700">
                  Easily use your digital identity across different platforms
                  and services. Masca supports popular identity systems like{' '}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    Polygon ID
                  </span>{' '}
                  and{' '}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    OID4VC
                  </span>
                  , making your life easier and more secure.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProvider;
