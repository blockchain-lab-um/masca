'use client';

import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { useGeneralStore } from '@/stores';

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
        <div className="dark:border-navy-blue-500 mt-6 rounded-3xl border border-gray-500 px-6 py-4">
          <div className="">
            <div className="text-h3 dark:text-navy-blue-50 text-gray-900">
              Masca
            </div>
            <div className="text-h4 dark:text-navy-blue-300 mt-2 text-gray-600">
              Manage Decentralized Identity in MetaMask
            </div>
          </div>
          <ul>
            <li className="mt-4">
              <div className=" flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="text-h3 dark:text-navy-blue-100 font-medium text-gray-900 ">
                  Feature A
                </div>
              </div>
              <div className="dark:text-navy-blue-200 mt-4 max-w-md text-gray-800">
                Use conversational language when explaining the snap. If you
                need to use a technical term, briefly define it so everyone can
                understand. Avoid jargon whenever possible, and keep your words
                short and simple. Introduce your snap in the context of your
                application to make it clear what the user gets if they install
                it.
              </div>
            </li>
            <li>
              <div className="flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="text-h3">Feature A</div>
              </div>
              <div className="max-w-md">
                Use conversational language when explaining the snap. If you
                need to use a technical term, briefly define it so everyone can
                understand. Avoid jargon whenever possible, and keep your words
                short and simple. Introduce your snap in the context of your
                application to make it clear what the user gets if they install
                it.
              </div>
            </li>
            <li>
              <div className="flex items-center gap-x-6">
                <PlusCircleIcon className="h-6 w-6" />
                <div className="text-h3">Feature A</div>
              </div>
              <div className="max-w-md">
                Use conversational language when explaining the snap. If you
                need to use a technical term, briefly define it so everyone can
                understand. Avoid jargon whenever possible, and keep your words
                short and simple. Introduce your snap in the context of your
                application to make it clear what the user gets if they install
                it.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProvider;
