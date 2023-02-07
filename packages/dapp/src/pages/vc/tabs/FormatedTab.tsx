/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React, { useState } from 'react';
import StoreIcon from 'src/components/StoreIcon';
import {
  DocumentDuplicateIcon,
  ShareIcon,
  TrashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Button from 'src/components/Button';
import DeleteModal from 'src/components/DeleteModal';
import ModifyDSModal from 'src/components/ModifyDSModal';
import Link from 'next/link';
import { useTableStore } from '../../../utils/store';

interface FormatedTabProps {
  vc: QueryVCsRequestResult;
}

export const FormatedTab = ({ vc }: FormatedTabProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyDSModalOpen, setModifyDSModalOpen] = useState(false);
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
  if (typeof vc.data.issuer === 'string') {
    issuer = vc.data.issuer;
  } else {
    issuer = vc.data.issuer.id;
  }
  let validity = true;
  if (vc.data.expirationDate)
    validity = Date.now() < Date.parse(vc.data.expirationDate);

  let types = '';
  if (vc.data.type) {
    if (typeof vc.data.type === 'string') {
      types = vc.data.type;
    } else {
      types = vc.data.type?.join(', ');
    }
  }

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
      <div className="relative h-full">
        <div className="flex flex-col lg:flex-row lg:justify-between m-3 py-3 px-8 rounded-3xl bg-orange-500">
          <div className="flex flex-col mb-2 border-b border-orange-300 lg:border-none pb-2 lg:pb-0 lg:mb-0 ">
            <span className="text-xs text-yellow-200/70 -mb-1">VALIDITY</span>

            <span className="font-semibold text-2xl text-white">
              {validity ? 'VALID' : 'EXPIRED'}
            </span>
            <span className="text-sm text-yellow-300 mt-4">{expDate}</span>
          </div>
          <div className="lg:ml-2 flex flex-col break-all">
            <span className="text-xs text-yellow-200/70 -mb-1">ISSUER</span>
            <div className="flex">
              <a
                href={`https://dev.uniresolver.io/#${issuer}`}
                target="_blank"
                rel="noreferrer"
                className="text-2xl font-semibold text-white underline underline-offset-2 hover:text-gray-100 animated-transition cursor-pointer"
              >
                {issuer.length > 20
                  ? `${issuer.slice(0, 18)}...${issuer.slice(-4)}`
                  : issuer}
              </a>
              <button
                className=""
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  navigator.clipboard.writeText(issuer);
                }}
              >
                <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-white hover:text-gray-100 animated-transition" />
              </button>
            </div>
            <span className="mt-4 text-sm text-yellow-300">Unknown</span>
          </div>
        </div>
        <div className="mt-8 pl-4 lg:pl-12 pr-2 lg:pr-8 ">
          <div className="text-md -mb-0.5 text-orange-500">TYPE</div>
          <div className="text-xl font-semibold text-orange-700 break-all">
            {types}
          </div>
          <ul className="mt-8">
            {Object.keys(vc.data.credentialSubject).map((key, id) => (
              <li key={id} className="mt-4 flex items-center">
                <div className="w-2 h-2 p-1 rounded-full bg-orange-500" />
                <div className="ml-2 lg:ml-4">
                  <div className="text-gray-700 text-sm">{key}</div>
                  <div className="text-gray-900 font-semibold break-all">
                    {vc.data.credentialSubject[key]}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 lg:px-8 mt-4">
          <span className="text-orange-500 text-sm">STORES</span>
          <div className="flex justify-between items-center -mt-1">
            {vc.metadata.store && (
              <div className="flex">
                {stores.map((store, id) => (
                  <StoreIcon store={store} key={id} />
                ))}
              </div>
            )}

            <div className="">
              <button
                onClick={() => setModifyDSModalOpen(true)}
                className="text-gray-800 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full"
              >
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
              <button className="text-gray-800 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                <ShareIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="text-gray-800 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 px-4">
          <span className="text-gray-700 text-sm font-semibold">
            {new Date(Date.parse(vc.data.issuanceDate)).toDateString()}
          </span>
        </div>

        <div className="flex justify-end p-3 lg:hidden">
          <Button variant="primary" size="sm">
            Create Presentation
          </Button>
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
