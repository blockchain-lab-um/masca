import { type QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { CredentialSubject } from '@veramo/core';

export const getLastWord = (str: string) => {
  const parts = str.trim().split(',');
  return parts[parts.length - 1];
};

export const getFirstWord = (str: string) => {
  const parts = str.trim().split(',');
  return parts[0];
};

export const stringifyCredentialSubject = (
  queryCredentialsRequestResult: QueryCredentialsRequestResult
): QueryCredentialsRequestResult => {
  const verifiableCredential = queryCredentialsRequestResult.data;
  const { credentialSubject } = verifiableCredential;
  const modifiedQueryCredentialsRequestResult = {
    ...queryCredentialsRequestResult,
    data: {
      ...verifiableCredential,
      credentialSubject: {
        ...credentialSubject,
        filterString: JSON.stringify(credentialSubject),
      } as CredentialSubject,
    },
  };

  return modifiedQueryCredentialsRequestResult;
};

export const removeCredentialSubjectFilterString = (
  queryCredentialsRequestResult: QueryCredentialsRequestResult
): QueryCredentialsRequestResult => {
  const verifiableCredential = queryCredentialsRequestResult.data;
  const { credentialSubject } = verifiableCredential;
  const { filterString, ...rest } = credentialSubject;
  const modifiedQueryCredentialsRequestResult = {
    ...queryCredentialsRequestResult,
    data: {
      ...verifiableCredential,
      credentialSubject: rest as CredentialSubject,
    },
  };

  return modifiedQueryCredentialsRequestResult;
};
