'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import { useGeneralStore } from '@/stores';

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

const MetaMaskProvider = ({ children }: MetaMaskProviderProps) => {
  const t = useTranslations('MetaMaskProvider');

  const { hasMM, hasSnaps } = useGeneralStore((state) => ({
    hasMM: state.hasMetaMask,
    hasSnaps: state.supportsSnaps,
  }));

  if (hasMM && hasSnaps) {
    return <>{children}</>;
  }

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex flex-1 items-center justify-center rounded-3xl bg-white shadow-lg">
      <div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-h4 md:text-h3 dark:text-navy-blue-50  text-gray-800">
            {t('metamask')}
          </h3>
          <h4 className="text-h4 md:text-h5 dark:text-navy-blue-50/50 mt-3 text-center text-gray-800/50">
            {t('version')}
          </h4>
        </div>
        <div className="mt-16 flex items-center justify-center">
          <Button
            variant="gray"
            onClick={() => {
              window.open('https://metamask.io/download/');
            }}
          >
            MetaMask
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskProvider;
