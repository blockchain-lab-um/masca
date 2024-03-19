'use client';

import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Image } from '@nextui-org/react';
import { Tooltip } from '@nextui-org/react';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { isAddress } from 'ethers/address';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo, useState } from 'react';

import { DIDDisplay } from '@/components/DIDDisplay';
import JsonModal from '@/components/JsonModal';
import { getFirstWord } from '@/utils/format';
import {
  camelToTitleCase,
  convertTypes,
  copyToClipboard,
} from '@/utils/string';
import { ImageLink } from '../ImageLink';

interface FormattedPanelProps {
  credential: VerifiableCredential;
}

const AddressDisplay = ({ address }: { address: string }) => {
  const t = useTranslations('AddressDisplay');
  return (
    <div className="flex flex-col space-y-0.5">
      <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
        Address:
      </h2>
      <div className="flex">
        <Tooltip content={t('tooltip')}>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md animated-transition dark:text-navy-blue-300 cursor-pointer font-normal text-gray-700 underline underline-offset-2"
          >
            {`${address.slice(0, 8)}...${address.slice(-8)}`}
          </a>
        </Tooltip>
        <button
          type="button"
          className="pl-1"
          onClick={() => copyToClipboard(address)}
        >
          <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-300 ml-1 h-5 w-5 text-gray-700 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};

const DisplayDate = ({ text, date }: { text: string; date: string }) => (
  <div className="flex flex-col items-start space-y-0.5">
    <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
      {text}:
    </h2>
    <h3 className="text-md dark:text-navy-blue-200 text-gray-700">
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
          if (key === 'id') return <DIDDisplay did={value} />;
          if (key === 'address' && isAddress(value)) {
            return <AddressDisplay address={value} />;
          }
          if (key === 'image') return <ImageLink value={value} />;
          if (!value || value === '' || value.length === 0) return null;

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
              <h2 className="dark:text-navy-blue-200 pr-2 font-bold capitalize text-gray-800">
                {camelToTitleCase(key)}:
              </h2>
              <div className="text-md dark:text-navy-blue-300 w-full truncate font-normal text-gray-700">
                {isObject ? (
                  <button
                    type="button"
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

const FormattedPanel = ({ credential }: FormattedPanelProps) => {
  const t = useTranslations('FormattedPanel');
  const types = useMemo(() => convertTypes(credential.type), [credential.type]);

  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [selectedJsonData, setSelectedJsonData] = useState({});

  const selectJsonData = (data: any) => {
    setSelectedJsonData(data);
    setJsonModalOpen(true);
  };

  const isValid = useMemo(() => {
    if (!credential.expirationDate) return true;
    return Date.parse(credential.expirationDate) > Date.now();
  }, [credential]);

  return (
    <>
      <div className="flex flex-col space-y-8">
        <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 flex max-w-full items-center rounded-2xl bg-gradient-to-b from-orange-100 to-pink-100 px-4 py-6 shadow-md">
          <div className="w-11/12">
            <Tooltip
              content={types}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                {getFirstWord(types)}
              </h1>
            </Tooltip>
          </div>
          <div className="flex flex-1 justify-end">
            <Tooltip
              content={
                isValid ? t('credential-valid') : t('credential-invalid')
              }
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              {isValid ? (
                <CheckCircleIcon className="dark:text-orange-accent-dark h-10 w-10 text-pink-500" />
              ) : (
                <ExclamationCircleIcon className="dark:text-orange-accent-dark h-10 w-10 text-pink-500" />
              )}
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col space-y-8 px-6 md:flex-row md:space-x-16 md:space-y-0">
          <div className="flex w-full flex-col items-start space-y-2 md:max-w-[50%]">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
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
                <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                  {t('issuer')}
                </h1>
                <div className="flex flex-col space-y-0.5">
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
                <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
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
      </div>
      <JsonModal
        isOpen={jsonModalOpen}
        setOpen={setJsonModalOpen}
        data={selectedJsonData}
      />
    </>
  );
};

export default FormattedPanel;
