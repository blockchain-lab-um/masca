/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React from 'react';
import StoreIcon from 'src/components/StoreIcon';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface FormatedTabProps {
  vc: QueryVCsRequestResult;
}

export const FormatedTab = ({ vc }: FormatedTabProps) => {
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

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between flex-1 m-3 px-5 py-3 rounded-3xl bg-orange-500 shadow-lg">
        <div className="flex flex-col">
          <span className="text-sm text-orange-200">VALIDITY</span>

          <span className=" text-2xl text-white mt-4 mb-2">
            {validity ? 'VALID' : 'EXPIRED'}
          </span>
          <span className="text-sm text-orange-200">
            {vc.data.expirationDate
              ? `Expires on ${new Date(
                  Date.parse(vc.data.expirationDate)
                ).toDateString()}`
              : 'Does not have an expiration date!'}
          </span>
        </div>
        <div className="basis-1/3 flex flex-col break-all">
          <span className="text-sm text-orange-200">ISSUER</span>
          <div className="flex">
            <a
              href={`https://dev.uniresolver.io/#${issuer}`}
              target="_blank"
              rel="noreferrer"
              className="text-2xl text-white underline underline-offset-2 hover:text-gray-100 animated-transition cursor-pointer mt-4 mb-2"
            >{`${issuer.slice(0, 20)}...${issuer.slice(-6)}`}</a>
            <button
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                navigator.clipboard.writeText(issuer);
              }}
            >
              <DocumentDuplicateIcon className="h-5 w-5 ml-1 text-white hover:text-gray-100 animated-transition" />
            </button>
          </div>
          <span className=" text-sm text-orange-200">Unknown</span>
        </div>
        <div className=" basis-1/3 flex flex-col break-words">
          <span className="text-sm text-orange-200">TYPE</span>

          <span className="text-2xl text-white mt-4 mb-2">{types}</span>
        </div>
      </div>
      <div className="p-3">
        <div>SUBJECT</div>
        <ul>
          {Object.keys(vc.data.credentialSubject).map((key, id) => (
            <li key={id}>
              <span className="font-semibold">{key}: </span>
              <span className="text-gray-900">
                {vc.data.credentialSubject[key]}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full border-t">MetaData</div>

      {vc.metadata.store && (
        <div className="flex">
          Stores:
          {stores.map((store, id) => (
            <StoreIcon store={store} key={id} />
          ))}
        </div>
      )}

      <div className="">
        Issuance date:{' '}
        {new Date(Date.parse(vc.data.issuanceDate)).toDateString()}
      </div>
      <div className="flex border-t">
        <div>Create VP</div>
        <div>Modify save</div>
        <div>Share</div>
        <div>Delete</div>
      </div>
    </div>
  );
};
