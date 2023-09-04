'use client';

import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
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
          Connect Wallet & Install Masca
        </div>
        <div className="dark:border-navy-blue-500 mt-8 rounded-3xl border border-gray-500 px-6 py-4">
          <div className="flex items-center gap-x-6">
            <div className="hidden sm:block">
              <MascaLogo />
            </div>
            <div>
              <div className="text-h3 dark:text-navy-blue-50 text-gray-900">
                Masca
              </div>
              <div className="text-h4 dark:text-navy-blue-300 mt-2 text-gray-600">
                Manage Decentralized Identity in MetaMask
              </div>
            </div>
          </div>
          <hr className="mt-4" />
          <ul>
            <li className="mt-12">
              <div className=" flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="dark:text-navy-blue-100 text-2xl font-medium text-gray-900 ">
                  Manage you Decentralized Identifiers
                </div>
              </div>
              <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-800">
                Create and manage your decentralized identifiers. Masca supports
                multiple popular DID methods.
              </div>
            </li>
            <li className="mt-8">
              <div className=" flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="dark:text-navy-blue-100 text-2xl font-medium text-gray-900 ">
                  Manage your Credentials
                </div>
              </div>
              <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-800">
                Store Verifiable Credentials in Masca or Onchain & use them to
                create Verifiable Presentation.
              </div>
            </li>
            <li className="mt-8">
              <div className=" flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="dark:text-navy-blue-100 text-2xl font-medium text-gray-900 ">
                  Receive and share Credentials
                </div>
              </div>
              <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-800">
                Masca supports Polygon ID & OID4VC flows to enable secure data
                sharing between entities.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProvider;
