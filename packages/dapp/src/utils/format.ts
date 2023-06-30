import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { CredentialSubject } from '@veramo/core';

export const stringifyCredentialSubject = (queryVCsRequestResult: QueryVCsRequestResult): QueryVCsRequestResult => {
  const verifiableCredential = queryVCsRequestResult.data;
  const { credentialSubject } = verifiableCredential;
  const modifiedQueryVCsRequestResult = {
    ...queryVCsRequestResult,
    data: {
      ...verifiableCredential,
      credentialSubject: {
        ...credentialSubject,
        filterString: JSON.stringify(credentialSubject),
      } as CredentialSubject,
    },
  };
  
  return modifiedQueryVCsRequestResult;
}

export const removeCredentialSubjectFilterString = (queryVCsRequestResult: QueryVCsRequestResult): QueryVCsRequestResult => {
  const verifiableCredential = queryVCsRequestResult.data;
  const { credentialSubject } = verifiableCredential;
  const { filterString, ...rest } = credentialSubject;
  const modifiedQueryVCsRequestResult = {
    ...queryVCsRequestResult,
    data: {
      ...verifiableCredential,
      credentialSubject: rest as CredentialSubject,
    },
  };

  return modifiedQueryVCsRequestResult;
}
