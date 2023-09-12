'use client';

import React from 'react';
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
      <div className="flex h-full flex-col items-center justify-center">
        <h3 className="text-h4 md:text-h3 dark:text-navy-blue-50 text-gray-800">
          {t('connect')}
        </h3>
        <h4 className="text-h4 md:text-h5 dark:text-navy-blue-50/50 mt-3 text-gray-800/50">
          {t('version')}
        </h4>
      </div>
    </div>
  );
};

export default ConnectedProvider;
