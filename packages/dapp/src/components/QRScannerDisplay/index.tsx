'use client';

import React from 'react';

import QRCodeScannerCard from '@/components/QRCodeScannerCard';
import { useGeneralStore } from '@/stores';
import { ConnectionScannerCard } from '../ConnectionScannerCard';

export const QRCodeScannerDisplay = () => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <div className="flex flex-1 flex-col justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
      <div className="dark:bg-navy-blue-800 flex h-min max-w-[48rem] flex-1 rounded-3xl bg-white p-4 shadow-lg sm:max-h-[32rem]">
        {isConnected ? <QRCodeScannerCard /> : <ConnectionScannerCard />}
      </div>
    </div>
  );
};
