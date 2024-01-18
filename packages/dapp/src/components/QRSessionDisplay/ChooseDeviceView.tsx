import React from 'react';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

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
  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <div className="flex w-full flex-col gap-y-4 sm:flex-row sm:gap-x-4">
          <button
            onClick={() => onDeviceTypeSelected('primary', true)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex w-full flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              {t('primary-has-camera')}
            </span>
            <span className="text-sm">{t('primary-has-camera-desc')}</span>
          </button>
          <button
            onClick={() => onDeviceTypeSelected('primary', false)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex w-full flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100"
          >
            <span className="dark:text-orange-accent-dark text-center font-bold text-pink-500">
              {t('primary-no-camera')}
            </span>
            <span className="text-sm">{t('primary-no-camera-desc')}</span>
            <div className="dark:text-navy-blue-400 text-xs text-gray-400">
              {t('primary-no-camera-desc-2')}
            </div>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={() => onDeviceTypeSelected('secondary', true)}
            className="animated-transition dark:border-navy-blue-400 dark:hover:bg-navy-blue-700 flex w-full flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-gray-500 p-4 hover:bg-gray-100"
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
