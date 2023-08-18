import React from 'react';

import { useGeneralStore } from '@/stores';

interface ChooseDeviceViewProps {
  onDeviceTypeSelected: (
    deviceType: 'primary' | 'secondary',
    hasCamera: boolean
  ) => void;
}

export const ChooseDeviceView = ({
  onDeviceTypeSelected,
}: ChooseDeviceViewProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      {isConnected ? (
        <>
          <button
            onClick={() => onDeviceTypeSelected('primary', true)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex h-[20rem] w-1/2 flex-col items-center justify-center gap-y-4  rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100 sm:h-[10rem] md:w-1/3"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              This Device can scan/upload QR codes
            </span>
            <span className="text-sm">
              I will use THIS device to Scan/Upload QR codes
            </span>
          </button>
          <button
            onClick={() => onDeviceTypeSelected('primary', false)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex h-[20rem] w-1/2 flex-col items-center justify-center  gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100 md:h-[10rem]"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              {`This Device can't scan/upload QR codes`}
            </span>
            <span className="text-sm">
              I will use a secondary (mobile) device to Scan/Upload QR codes
            </span>
            <div className="dark:text-navy-blue-400 text-xs text-gray-400">
              (Requires a secondary device to work)
            </div>
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={() => onDeviceTypeSelected('secondary', true)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex h-[10rem] w-2/3 flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              Secondary Device
            </span>
            <span className="text-sm">
              I will use this device to scan/upload QR codes.
            </span>
            <div className="dark:text-navy-blue-400 text-xs text-gray-400">
              (Requires a primary device to work)
            </div>
          </button>
          <div className="dark:text-navy-blue-400 mt-4 text-sm text-gray-400">
            Connect Wallet to see more options...
          </div>
        </div>
      )}
    </div>
  );
};
