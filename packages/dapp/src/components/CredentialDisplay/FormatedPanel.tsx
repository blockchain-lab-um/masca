import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import DeleteModal from '@/components/DeleteModal';
import ModifyDSModal from '@/components/ModifyDSModal';
import StoreIcon from '@/components/StoreIcon';
import Tooltip from '@/components/Tooltip';
import { convertTypes, copyToClipboard } from '@/utils/string';
import { useTableStore } from '@/stores';

interface FormatedTabProps {
  vc: QueryVCsRequestResult;
  deleteModalOpen: boolean;
  modifyDSModalOpen: boolean;
  setDeleteModalOpen: (value: boolean) => void;
  setModifyDSModalOpen: (value: boolean) => void;
}

const FormatedTab = ({
  vc,
  setDeleteModalOpen,
  setModifyDSModalOpen,
  modifyDSModalOpen,
  deleteModalOpen,
}: FormatedTabProps) => {
  const t = useTranslations('VerifiableCredential');
  const setSelectedVCs = useTableStore((state) => state.setSelectedVCs);

  let stores: string[] = [];
  if (vc.metadata.store) {
    if (typeof vc.metadata.store === 'string') {
      stores = [vc.metadata.store];
    } else {
      stores = vc.metadata.store;
    }
  }
  let issuer = '';
  if (vc.data.issuer) {
    if (typeof vc.data.issuer === 'string') {
      issuer = vc.data.issuer;
    } else if (vc.data.issuer.id) {
      issuer = vc.data.issuer.id;
    }
  }
  let validity = true;
  if (vc.data.expirationDate)
    validity = Date.now() < Date.parse(vc.data.expirationDate);

  const types = convertTypes(vc.data.type);

  return (
    <>
      <div className="relative h-full px-8">
        <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 mt-6 flex rounded-2xl bg-gradient-to-b from-orange-100 to-pink-100 px-8 shadow-md">
          <div className="flex w-[90%] py-8 lg:w-[90%]">
            <Tooltip tooltip={types}>
              <div className="font-ubuntu dark:text-orange-accent-dark w-[55%] truncate text-2xl font-medium text-pink-500 lg:w-[70%]">
                {types}
              </div>
            </Tooltip>
          </div>
          <div className="flex items-center justify-end">
            {validity ? (
              <Tooltip tooltip={'Credential is valid'}>
                <CheckCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              </Tooltip>
            ) : (
              <Tooltip tooltip={'Credential expired'}>
                <ExclamationCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              </Tooltip>
            )}
          </div>
        </div>

        <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 mb-8 mt-6 grid grid-cols-1 break-all rounded-2xl  px-8 pb-14 pt-5 lg:grid-cols-2">
          <div className="px-1 lg:col-span-2 lg:col-start-1">
            <span className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {t('formatted-tab.subject')}
            </span>
            <ul className="dark:text-navy-blue-200 text-gray-900">
              {Object.keys(vc.data.credentialSubject).map((key, id) => (
                <li key={id} className="mt-3 flex items-center">
                  {key === 'id' ? (
                    <div>
                      <div className="text-md break-all">
                        <span className="flex">
                          <span className="font-bold">DID:</span>
                          <Tooltip tooltip={'Open DID in Universal resolver'}>
                            <a
                              href={`https://dev.uniresolver.io/#${
                                vc.data.credentialSubject[key] as string
                              }`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-md animated-transition dark:text-navy-blue-300 ml-1 cursor-pointer font-normal text-gray-800 underline underline-offset-2"
                            >
                              {vc.data.credentialSubject.id && (
                                <>
                                  {vc.data.credentialSubject.id.length > 20
                                    ? `${vc.data.credentialSubject.id.slice(
                                        0,
                                        22
                                      )}...${vc.data.credentialSubject.id.slice(
                                        -4
                                      )}`
                                    : vc.data.credentialSubject.id}
                                </>
                              )}
                            </a>
                          </Tooltip>
                          <button
                            className=""
                            onClick={() =>
                              copyToClipboard(
                                vc.data.credentialSubject.id?.toString() || ''
                              )
                            }
                          >
                            <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-300 ml-1 h-5 w-5 text-gray-800 hover:text-gray-700" />
                          </button>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="dark:text-navy-blue-300 break-all text-gray-800">
                        <span className="dark:text-navy-blue-200 font-bold text-gray-900">
                          {key}:{' '}
                        </span>{' '}
                        {vc.data.credentialSubject[key]}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col px-1 lg:col-start-3">
            <div>
              <span className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                {t('formatted-tab.issuer')}
              </span>
              <div className="text-md dark:text-navy-blue-200 break-all font-semibold text-gray-800">
                <div className="mt-3 flex">
                  <span className="dark:text-navy-blue-200 font-bold text-gray-900">
                    DID:
                  </span>
                  <Tooltip tooltip={t('tooltip.open-did')}>
                    <a
                      href={`https://dev.uniresolver.io/#${issuer}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-md animated-transition dark:text-navy-blue-300 ml-1 cursor-pointer font-normal text-gray-800 underline underline-offset-2"
                    >
                      {issuer.length > 20
                        ? `${issuer.slice(0, 18)}...${issuer.slice(-4)}`
                        : issuer}
                    </a>
                  </Tooltip>
                  <button
                    className=""
                    onClick={() => {
                      copyToClipboard(issuer);
                    }}
                  >
                    <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-300 ml-1 h-5 w-5 text-gray-800 hover:text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <span className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                {t('formatted-tab.dates')}
              </span>

              <div className="mt-2">
                <div className="text-md dark:text-navy-blue-300 break-all text-gray-800">
                  <span className="dark:text-navy-blue-200 font-bold text-gray-900">
                    {t('formatted-tab.issuance-date')}:{' '}
                  </span>
                  {new Date(Date.parse(vc.data.issuanceDate)).toDateString()}
                </div>
                {vc.data.expirationDate ? (
                  <div className="text-md dark:text-navy-blue-200 break-all text-gray-800">
                    <span className="dark:text-navy-blue-200 font-bold text-gray-900">
                      {t('formatted-tab.expiration-date')}:{' '}
                    </span>
                    {new Date(
                      Date.parse(vc.data.expirationDate)
                    ).toDateString()}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="mt-8">
              <span className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                {t('formatted-tab.store')}
              </span>
              {vc.metadata.store && (
                <div className="mt-3 flex gap-x-1">
                  {stores.map((store, id) => (
                    <Tooltip tooltip={store} key={id}>
                      <div className="mt-1">
                        <StoreIcon store={store} key={id} />
                      </div>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 right-10 hidden lg:block">
          <Link href="/app/create-verifiable-presentation">
            <Button
              variant="primary"
              onClick={() => setSelectedVCs([vc])}
              size="sm"
            >
              {t('formatted-tab.create-verifiable-presentation')}
            </Button>
          </Link>
        </div>
      </div>
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        vc={vc}
      />
      <ModifyDSModal
        open={modifyDSModalOpen}
        setOpen={setModifyDSModalOpen}
        vc={vc}
      />
    </>
  );
};

export default FormatedTab;
