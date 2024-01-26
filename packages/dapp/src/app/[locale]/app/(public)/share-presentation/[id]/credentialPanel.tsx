'use client';

import { Fragment, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { DIDDisplay } from '@/components/DIDDisplay';
import JsonModal from '@/components/JsonModal';
import { convertTypes, copyToClipboard } from '@/utils/string';

interface FormatedPanelProps {
  credential: VerifiableCredential;
}

const AddressDisplay = ({ address }: { address: string }) => {
  const t = useTranslations('AddressDisplay');
  return (
    <div className="flex flex-col space-y-0.5">
      <h2 className="pr-2 font-bold text-gray-800 dark:text-navy-blue-200">
        {t('title')}:
      </h2>
      <div className="flex">
        <Tooltip
          className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
          content={t('tooltip')}
        >
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-gray-700 underline cursor-pointer text-md animated-transition dark:text-navy-blue-300 underline-offset-2"
          >
            {`${address.slice(0, 8)}...${address.slice(-8)}`}
          </a>
        </Tooltip>
        <button className="pl-1" onClick={() => copyToClipboard(address)}>
          <DocumentDuplicateIcon className="w-5 h-5 ml-1 text-gray-700 animated-transition dark:text-navy-blue-300 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};

const DisplayDate = ({ text, date }: { text: string; date: string }) => (
  <div className="flex flex-col items-start space-y-0.5">
    <h2 className="pr-2 font-bold text-gray-800 dark:text-navy-blue-200">
      {text}:
    </h2>
    <h3 className="text-gray-700 text-md dark:text-navy-blue-200">
      {new Date(Date.parse(date)).toDateString()}
    </h3>
  </div>
);

const CredentialSubject = ({
  data,
  viewJsonText,
  selectJsonData,
}: {
  data: Record<string, any>;
  viewJsonText: string;
  selectJsonData: React.Dispatch<React.SetStateAction<any>>;
}) => (
  <>
    {Object.entries(data).map(([key, value]: [string, any]) => (
      <Fragment key={key}>
        {(() => {
          if (key === 'id') {
            return (
              <>
                <div className="flex flex-col space-y-0.5">
                  <h2 className="pr-2 font-bold text-gray-800 dark:text-navy-blue-200">
                    DID:
                  </h2>
                  <div className="flex">
                    <DIDDisplay did={value} />
                  </div>
                </div>
              </>
            );
          }

          if (key === 'address') return <AddressDisplay address={value} />;

          const isObject = !(
            typeof value === 'string' || typeof value === 'number'
          );

          return (
            <div
              className={clsx(
                'flex w-full overflow-clip',
                isObject ? 'items-center' : 'flex-col items-start space-y-0.5'
              )}
            >
              <h2 className="pr-2 font-bold text-gray-800 capitalize dark:text-navy-blue-200">
                {key}:
              </h2>
              <div className="w-full font-normal text-gray-700 truncate text-md dark:text-navy-blue-300">
                {isObject ? (
                  <button
                    className="dark:border-navy-blue-300 dark:hover:border-navy-blue-400 dark:focus:ring-navy-blue-500 rounded-md border border-gray-300 px-2 py-0.5 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={() => selectJsonData(value)}
                  >
                    {viewJsonText}
                  </button>
                ) : (
                  value
                )}
              </div>
            </div>
          );
        })()}
      </Fragment>
    ))}
  </>
);

const CredentialPanel = ({ credential }: FormatedPanelProps) => {
  const t = useTranslations('CredentialPanel');

  const pathname = usePathname();
  const router = useRouter();

  // Local state
  const types = useMemo(() => convertTypes(credential.type), [credential.type]);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [selectedJsonData, setSelectedJsonData] = useState({});

  const isValid = useMemo(() => {
    if (!credential.expirationDate) return true;
    return Date.parse(credential.expirationDate) > Date.now();
  }, [credential]);

  const selectJsonData = (data: any) => {
    setSelectedJsonData(data);
    setJsonModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col-reverse px-6 pt-6 items-cetner sm:flex-row">
          <div className="w-full sm:w-11/12">
            <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
              {t('title')}
            </h2>
            <Tooltip
              content={types}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <h1 className="text-lg font-medium text-left text-pink-500 font-ubuntu dark:text-orange-accent-dark sm:text-xl md:text-2xl lg:truncate">
                {types}
              </h1>
            </Tooltip>
          </div>
          <div className="flex justify-end flex-1 w-full space-x-1">
            <Tooltip
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
              content={
                isValid ? t('credential-valid') : t('credential-invalid')
              }
            >
              {isValid ? (
                <CheckCircleIcon className="w-12 h-12 text-pink-500 dark:text-orange-accent-dark" />
              ) : (
                <ExclamationCircleIcon className="w-12 h-12 text-pink-500 dark:text-orange-accent-dark" />
              )}
            </Tooltip>
            <div className="flex flex-col items-end">
              <h1 className="text-lg font-medium text-left text-pink-500 font-ubuntu dark:text-orange-accent-dark sm:text-xl md:text-2xl lg:truncate">
                {t('status')}
              </h1>
              <h2 className="font-bold text-gray-800 dark:text-navy-blue-200">
                {isValid ? 'Valid' : 'Invalid'}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 space-y-8 md:flex-row md:space-x-16 md:space-y-0">
          <div className="flex w-full flex-col items-start space-y-2 md:max-w-[50%]">
            <h1 className="font-medium text-pink-500 text-md dark:text-orange-accent-dark">
              {t('subject')}
            </h1>
            <CredentialSubject
              data={credential.credentialSubject}
              viewJsonText={t('view-json')}
              selectJsonData={selectJsonData}
            />
          </div>
          <div className="flex flex-1">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col items-start justify-center space-y-2 ">
                <h1 className="font-medium text-pink-500 text-md dark:text-orange-accent-dark">
                  {t('issuer')}
                </h1>
                <div className="flex flex-col space-y-0.5">
                  <h2 className="pr-2 font-bold text-gray-800 dark:text-navy-blue-200">
                    DID:
                  </h2>
                  <div className="flex">
                    <DIDDisplay
                      did={
                        typeof credential.issuer === 'string'
                          ? credential.issuer
                          : credential.issuer.id
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <h1 className="font-medium text-pink-500 text-md dark:text-orange-accent-dark">
                  {t('dates')}
                </h1>
                <DisplayDate
                  text="Issuance date"
                  date={credential.issuanceDate}
                />
                {credential.expirationDate && (
                  <DisplayDate
                    text="Expiration date"
                    date={credential.expirationDate}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="px-6 font-medium text-gray-700 cursor-pointer text-md dark:text-navy-blue-200"
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set('view', 'Json');
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          {t('view-json')}
        </div>
      </div>
      <JsonModal
        isOpen={jsonModalOpen}
        setOpen={setJsonModalOpen}
        data={selectedJsonData}
      />
    </>
  );
};

export default CredentialPanel;
