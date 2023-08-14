'use client';

import React from 'react';

import ScanConnectionCard from '@/components/ScanConnectionCard';
import { useGeneralStore } from '@/stores';

export const QRCodeScannerDisplay = () => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <div className="flex flex-1 flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
      <div className="dark:bg-navy-blue-800 flex max-h-[32rem] flex-1 rounded-3xl bg-white p-4  shadow-lg">
        <ScanConnectionCard />
      </div>
    </div>
  );
};
