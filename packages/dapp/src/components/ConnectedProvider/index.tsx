'use client';

import {
  CreditCardIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useAccount } from 'wagmi';

import MascaLogo from '../MascaLogo';

interface ConnectedProviderProps {
  children: React.ReactNode;
}

const ConnectedProvider = ({ children }: ConnectedProviderProps) => {
  const t = useTranslations('ConnectedProvider');
  const { isConnected } = useAccount();

  return isConnected ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col items-center h-full justify-center px-6 sm:px-12 dark:bg-navy-blue-800 dark:text-navy-blue-400 py-12 rounded-3xl bg-white shadow-lg">
      <div className="flex flex-col">
        <div className="flex w-full flex-col items-center justify-center">
          <h3 className="text-h4 sm:text-h3 dark:text-navy-blue-50 text-center text-gray-900">
            {t('connect')}
          </h3>
          <h4 className="text-h4 sm:text-h5 dark:text-navy-blue-50/50 mt-3 text-center text-gray-900/50">
            {t('version')}
          </h4>
        </div>
        <div className="dark:border-navy-blue-500 mt-4 rounded-3xl border border-gray-500 px-6 py-8 sm:px-12 md:min-w-[40em]">
          <div className="flex items-center gap-x-6">
            <div className="hidden sm:block">
              <MascaLogo />
            </div>
            <div>
              <div className="text-h4 sm:text-h3 w-full dark:text-navy-blue-50 font-ubuntu text-gray-900">
                {t('masca')}
              </div>
              <div className="text-h5 sm:text-h4 w-full dark:text-navy-blue-300 font-ubuntu mt-2 text-gray-600">
                {t('masca-desc')}
              </div>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="flex justify-center">
            <ul className="text-md flex flex-col items-start text-justify tracking-normal sm:text-xl">
              <li className="mt-12 max-sm:mt-4">
                <div className="flex items-center gap-x-4">
                  <LockClosedIcon className="dark:text-orange-accent-dark h-6 w-6 text-pink-500 sm:h-8 sm:w-8" />
                  <div className="dark:text-navy-blue-50 font-ubuntu text-md text-start font-medium text-gray-900 sm:text-2xl ">
                    {t('features.feat-1')}
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 max-w-[42em] text-gray-700">
                  {t('features.desc-1-1')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-1-2')}
                  </span>
                  {t('features.desc-1-3')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-1-4')}
                  </span>
                  .
                </div>
              </li>
              <li className="mt-12 max-sm:mt-4">
                <div className=" flex items-center gap-x-4">
                  <CreditCardIcon className="dark:text-orange-accent-dark h-6 w-6 text-pink-500 sm:h-8 sm:w-8" />
                  <div className="dark:text-navy-blue-50 font-ubuntu text-md text-start font-medium text-gray-900 sm:text-2xl ">
                    {t('features.feat-2')}
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 text-gray-700 max-w-[42em]">
                  {t('features.desc-2-1')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-2-2')}
                  </span>
                  {t('features.desc-2-3')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-2-4')}
                  </span>
                  .
                </div>
              </li>
              <li className="mt-12 max-sm:mt-4">
                <div className="flex items-center gap-x-4">
                  <GlobeAltIcon className="dark:text-orange-accent-dark h-8 w-8 text-pink-500 sm:h-8 sm:w-8" />
                  <div className="dark:text-navy-blue-50 font-ubuntu text-md max-w-[15em] text-start font-medium text-gray-900 sm:text-2xl ">
                    {t('features.feat-3')}
                  </div>
                </div>
                <div className="dark:text-navy-blue-200 mt-4 text-gray-700 max-w-[42em]">
                  {t('features.desc-3-1')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-3-2')}
                  </span>
                  {t('features.desc-3-3')}
                  <span className="dark:text-navy-blue-100 font-bold text-gray-800">
                    {t('features.desc-3-4')}
                  </span>
                  {t('features.desc-3-5')}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProvider;
