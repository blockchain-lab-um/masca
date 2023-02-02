/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React from 'react';
import StoreIcon from 'src/components/StoreIcon';

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
  let issuer;
  if (typeof vc.data.issuer === 'string') {
    issuer = vc.data.issuer;
  } else {
    issuer = vc.data.issuer.id;
  }

  return (
    <div>
      <div className="grid grid-cols-2 p-2">
        <div className="">
          <div>VC Details</div>
          <ul>
            <li>
              <span className="font-semibold">Type: </span>
              <span className="text-gray-900">{vc.data.type}</span>
            </li>
            <li>
              <span className="font-semibold">Subject: </span>
              <span className="text-gray-900">
                {vc.data.credentialSubject.id}
              </span>
            </li>
            <li>
              <span className="font-semibold">Issuer: </span>
              <span className="text-gray-900">{issuer}</span>
            </li>
            <li>
              <span className="font-semibold">Issuance Date: </span>
              <span className="text-gray-900">{vc.data.issuanceDate}</span>
            </li>
            {vc.data.expirationDate && (
              <li>
                <span className="font-semibold">Expiration Date: </span>
                <span className="text-gray-900">{vc.data.expirationDate}</span>
              </li>
            )}
          </ul>
        </div>
        <div>
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

      <div className="">Snap ID: {vc.metadata.id}</div>
      <div className="flex border-t">
        <div>Create VP</div>
        <div>Modify save</div>
        <div>Share</div>
        <div>Delete</div>
      </div>
    </div>
  );
};
