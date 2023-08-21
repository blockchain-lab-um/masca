'use client';

import React from 'react';

import QRCodeScannerStepper from '../QRCodeScannerStepper';

const QRCodeScannerDisplay = () => (
  <div className="flex flex-1 flex-col justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
    <div className="dark:bg-navy-blue-800 flex h-min min-h-fit max-w-[48rem] flex-1 rounded-3xl bg-white p-4 shadow-lg">
      <QRCodeScannerStepper />
    </div>
  </div>
);

export default QRCodeScannerDisplay;
