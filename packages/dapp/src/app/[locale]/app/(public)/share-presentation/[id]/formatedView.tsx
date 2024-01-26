'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Pagination, Tooltip } from '@nextui-org/react';
import { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';

import { copyToClipboard } from '@/utils/string';
import CredentialPanel from './credentialPanel';

export const FormatedView = ({
  credential,
  holder,
  expirationDate,
  issuanceDate,
  page,
  total,
}: {
  credential: VerifiableCredential;
  holder: string;
  expirationDate: string | undefined;
  issuanceDate: string | undefined;
  page: string;
  total: number;
}) => {
  const t = useTranslations('FormatedView');

  const router = useRouter();
  const pathname = usePathname();

  const isValid = useMemo(() => {
    if (!expirationDate) return true;
    return Date.parse(expirationDate) > Date.now();
  }, [expirationDate]);

  return (
    <>
      <div className="w-full h-full bg-white shadow-lg dark:bg-navy-blue-800 rounded-3xl">
        <div className="flex flex-col-reverse items-center max-w-full px-10 pt-6 pb-2 space-x-4 dark:from-navy-blue-700 dark:to-navy-blue-700 rounded-t-2xl bg-gradient-to-br from-pink-100 to-orange-100 sm:flex-row">
          <div className="flex w-full">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
                  {t('holder')}
                </h2>
                <h1 className="text-lg font-medium text-left text-pink-500 font-ubuntu dark:text-orange-accent-dark sm:text-xl md:text-2xl lg:truncate">
                  {/* {holder.substring(0, 20)}...
                  {holder.substring(holder.length, holder.length - 10)} */}
                  <div className="flex items-center mt-2">
                    <Tooltip
                      content={holder}
                      className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                    >
                      <a
                        href={`https://dev.uniresolver.io/#${holder}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg font-medium text-left text-pink-500 underline font-ubuntu dark:text-orange-accent-dark sm:text-xl md:text-2xl lg:truncate"
                      >{`${holder.substring(
                        0,
                        holder.lastIndexOf(':')
                      )}:${holder
                        .split(':')
                        [holder.split(':').length - 1].slice(
                          0,
                          10
                        )}...${holder.slice(-10)}`}</a>
                    </Tooltip>
                    <button
                      onClick={() => {
                        copyToClipboard(holder);
                      }}
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 ml-1 text-pink-500 animated-transition dark:text-orange-accent-dark hover:opacity-80" />
                    </button>
                  </div>
                </h1>
              </div>
              {issuanceDate && (
                <div className="flex flex-col">
                  <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
                    {t('presented')}
                  </h2>
                  {new Date(Date.parse(issuanceDate)).toDateString()}
                </div>
              )}
              <div className="flex flex-col">
                <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
                  {t('credentials')}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex justify-end flex-1 w-full space-x-1">
            <Tooltip
              content={
                isValid ? t('presentation-valid') : t('presentation-invalid')
              }
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              {isValid ? (
                <CheckCircleIcon className="w-12 h-12 text-pink-500 dark:text-orange-accent-dark" />
              ) : (
                <ExclamationCircleIcon className="w-12 h-12 text-pink-500 dark:text-orange-accent-dark" />
              )}
            </Tooltip>
            <div className="flex flex-col items-end">
              <h1 className="text-lg font-medium text-left text-pink-500 font-ubuntu dark:text-orange-accent-dark sm:text-xl md:text-2xl lg:truncate">
                {t('credential-status')}
              </h1>
              <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
                {isValid ? t('valid') : t('invalid')}
              </h2>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6">
          <div className="ml-[14px] flex justify-start px-2">
            <Pagination
              loop
              color="success"
              total={total}
              initialPage={parseInt(page, 10)}
              onChange={(val) => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', val.toString());
                params.set('view', 'Normal');
                router.replace(`${pathname}?${params.toString()}`);
              }}
              classNames={{
                wrapper:
                  'space-x-2 pl-4 pr-6 pb-2 pt-1 rounded-none rounded-b-2xl bg-gradient-to-tr from-pink-100 to-orange-100 dark:from-navy-blue-700 dark:to-navy-blue-700',
                item: 'flex-nowrap w-5 h-5 text-black dark:text-navy-blue-200 bg-inherit shadow-none active:bg-inherit active:text-black dark:active:text-navy-blue-200 [&[data-hover=true]:not([data-active=true])]:bg-inherit',
                cursor:
                  'w-5 h-5 rounded-full dark:bg-orange-accent-dark bg-pink-500 text-white dark:text-navy-blue-800',
              }}
            />
          </div>
          <CredentialPanel credential={credential} />
        </div>
      </div>
    </>
  );
};
