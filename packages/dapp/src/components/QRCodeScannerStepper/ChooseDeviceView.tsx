import React from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('ChooseDeviceView');
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
              {t('primary-has-camera')}
            </span>
            <span className="text-sm">{t('primary-has-camera-desc')}</span>
          </button>
          <button
            onClick={() => onDeviceTypeSelected('primary', false)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex h-[20rem] w-1/2 flex-col items-center justify-center  gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100 md:h-[10rem]"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              {t('primary-no-camera')}
            </span>
            <span className="text-sm">{t('primary-no-camera-desc')}</span>
            <div className="dark:text-navy-blue-400 text-xs text-gray-400">
              {t('primary-no-camera-desc-2')}
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
              {t('secondary')}
            </span>
            <span className="text-sm">{t('secondary-desc')}</span>
            <div className="dark:text-navy-blue-400 text-xs text-gray-400">
              {t('secondary-desc-2')}
            </div>
          </button>
          <div className="dark:text-navy-blue-400 mt-4 text-sm text-gray-400">
            {t('connect')}
          </div>
        </div>
      )}
    </div>
  );
};
