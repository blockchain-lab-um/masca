'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Pagination, Tooltip } from '@nextui-org/react';
import { IVerifyResult, VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';

import { VerificationInfoModal } from '@/components/VerificationInfoModal';
import CredentialPanel from './credentialPanel';

export const FormatedView = ({
  credential,
  holder,
  expirationDate,
  issuanceDate,
  page,
  total,
  verificationResult,
}: {
  credential: VerifiableCredential;
  holder: string;
  expirationDate: string | undefined;
  issuanceDate: string | undefined;
  page: string;
  total: number;
  verificationResult: IVerifyResult;
}) => {
  const t = useTranslations('FormatedView');

  const [verificationInfoModalOpen, setVerificationInfoModalOpen] =
    useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isValid = useMemo(() => {
    if (!expirationDate) return true;
    return Date.parse(expirationDate) > Date.now();
  }, [expirationDate]);

  return (
    <>
      <div className="dark:bg-navy-blue-800 relative h-full w-full rounded-3xl bg-white shadow-lg">
        <InformationCircleIcon
          onClick={() => setVerificationInfoModalOpen(true)}
          className="absolute right-3 top-3 h-6 w-6 cursor-pointer"
        />
        <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 flex max-w-full flex-col-reverse items-center space-x-4 rounded-t-2xl bg-gradient-to-br from-pink-100 to-orange-100 px-10 pt-6 sm:flex-row">
          <div className="flex w-full">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
                  {t('holder')}
                </h2>
                <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                  {holder.length <= 32 ? (
                    holder
                  ) : (
                    <>
                      {holder.substring(0, 20)}...
                      {holder.substring(holder.length - 10)}
                    </>
                  )}
                </h1>
              </div>
              {issuanceDate && (
                <div className="flex flex-col">
                  <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
                    {t('presented')}
                  </h2>
                  {new Date(Date.parse(issuanceDate)).toDateString()}
                </div>
              )}
              <div className="flex flex-col">
                <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
                  {t('credentials')}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-1 justify-end space-x-1">
            <Tooltip
              content={
                isValid ? t('presentation-valid') : t('presentation-invalid')
              }
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              {isValid ? (
                <CheckCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              ) : (
                <ExclamationCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              )}
            </Tooltip>
            <div className="flex flex-col items-end">
              <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                {t('credential-status')}
              </h1>
              <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
                {isValid ? t('valid') : t('invalid')}
              </h2>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6">
          <div className="flex justify-start px-2">
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
      <VerificationInfoModal
        isOpen={verificationInfoModalOpen}
        setOpen={setVerificationInfoModalOpen}
      />
    </>
  );
};
