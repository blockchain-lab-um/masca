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

  const { hasMM, hasFlask } = useGeneralStore(
    (state) => ({
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
    }),
  );

  if (hasMM && hasFlask) {
    return <>{children}</>;
  }

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex-1 rounded-3xl bg-white shadow-lg">
      <div className="flex h-full items-center justify-center">
        <div>
          <h3 className="text-h4 md:text-h3 dark:text-navy-blue-50 text-gray-800">
            {t('flask')}
          </h3>
          <div className="mt-16 flex items-center justify-center">
            <Button
              variant="gray"
              onClick={() => {
                window.open('https://metamask.io/flask/');
              }}
            >
              MetaMask Flask
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
    </div>
  );
};

export default MetaMaskProvider;
