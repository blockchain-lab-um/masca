import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React from 'react';

interface FormatedTabProps {
  vc: QueryVCsRequestResult;
}

export const FormatedTab = ({ vc }: FormatedTabProps) => {
  return (
    <div>
      <div className="flex">
        <div>Type {vc.data.type}</div>
        <div>Subject {vc.data.credentialSubject.id}</div>
        <div>
          Issuer{' '}
          {typeof vc.data.issuer === 'string'
            ? vc.data.issuer
            : vc.data.issuer.id}
        </div>
        <div>Issuance Date {vc.data.issuanceDate}</div>
        <div>Expiration Date {vc.data.expirationDate}</div>
      </div>
      <div>MetaData</div>
    </div>
  );
};
