import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

import Button from '@/components/Button';
import DeleteModal from '@/components/DeleteModal';
import ModifyDSModal from '@/components/ModifyDSModal';
import StoreIcon from '@/components/StoreIcon';
import Tooltip from '@/components/Tooltip';
import { useTableStore } from '@/utils/stores';
import { convertTypes, copyToClipboard } from '@/utils/string';

interface FormatedTabProps {
  vc: QueryVCsRequestResult;
  deleteModalOpen: boolean;
  modifyDSModalOpen: boolean;
  setDeleteModalOpen: (value: boolean) => void;
  setModifyDSModalOpen: (value: boolean) => void;
}

export const FormatedTab = ({
  vc,
  setDeleteModalOpen,
  setModifyDSModalOpen,
  modifyDSModalOpen,
  deleteModalOpen,
}: FormatedTabProps) => {
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
  console.log('types', types);

  const expDate = vc.data.expirationDate
    ? `Expires on ${new Date(
        Date.parse(vc.data.expirationDate)
      ).getDay()}.${new Date(
        Date.parse(vc.data.expirationDate)
      ).getMonth()}.${new Date(
        Date.parse(vc.data.expirationDate)
      ).getFullYear()}`
    : 'Does not expire';

  return (
    <>
      <div className="relative h-full px-8">
        <div className="mt-8 rounded-2xl px-4 py-8 bg-gradient-to-b from-orange-50 to-pink-50 grid grid-cols-3">
          <div className="col-start-1 col-span-2 row-span-2 truncate pr-2 text-h3 text-orange-500 font-semibold">
            {types}
          </div>
          <div className="col-start-3 text-right">
            <div>{validity ? 'VALID' : 'EXPIRED'}</div>
            <div className="text-gray-700 text-sm">{expDate}</div>
          </div>
        </div>

        <div className="mb-8 mt-6 break-all rounded-2xl px-8 py-4 bg-gradient-to-b from-orange-50 to-pink-50 grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:col-start-1 lg:col-span-2 flex flex-col px-1">
            <span className="text-sm text-orange-500 font-semibold">
              SUBJECT
            </span>
            <ul className="">
              {Object.keys(vc.data.credentialSubject).map((key, id) => (
                <li key={id} className="mt-4 flex items-center">
                  {key === 'id' ? (
                    <div>
                      <div className="text-gray-700 text-sm">{key}</div>
                      <div className="text-gray-900 font-semibold text-md break-all">
                        <div className="flex">
                          <Tooltip tooltip={'Open DID in Universal resolver'}>
                            <a
                              href={`https://dev.uniresolver.io/#${
                                vc.data.credentialSubject[key] as string
                              }`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-md font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-700 animated-transition cursor-pointer"
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
                            <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 hover:text-gray-700 animated-transition" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="text-gray-700 text-sm">{key}</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {vc.data.credentialSubject[key]}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-start-3 flex flex-col px-1">
            <div>
              <span className="text-sm text-orange-500 font-semibold">
                ISSUER
              </span>
              <div className="text-gray-700 text-sm mt-1">DID</div>
              <div className="text-gray-900 font-semibold text-md break-all">
                <div className="flex">
                  <Tooltip tooltip={'Open DID in Universal resolver'}>
                    <a
                      href={`https://dev.uniresolver.io/#${issuer}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-md font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-700 animated-transition cursor-pointer"
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
                    <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-gray-900 hover:text-gray-700 animated-transition" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-500 font-semibold">
                DATES
              </span>

              <div className="">
                <div className="text-gray-700 text-sm mt-1">Issuance Date</div>
                <div className="text-gray-900 font-semibold text-md break-all">
                  {new Date(Date.parse(vc.data.issuanceDate)).toDateString()}
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  Expiration Date
                </div>
                {vc.data.expirationDate ? (
                  <div className="text-gray-900 font-semibold text-md break-all">
                    {new Date(
                      Date.parse(vc.data.expirationDate)
                    ).toDateString()}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-500 font-semibold">
                DATA STORES
              </span>
              {vc.metadata.store && (
                <div className="flex mt-1">
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

        <div className="hidden lg:block absolute -bottom-4 right-10">
          <Link href="createVP">
            <Button
              variant="primary"
              onClick={() => setSelectedVCs([vc])}
              size="sm"
            >
              Create Presentation
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
