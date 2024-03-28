import type { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import type { CredentialSubject } from '@veramo/core';

export const getLastWord = (str: string) => {
  const parts = str.trim().split(',');
  return parts[parts.length - 1];
};

export const capitalizeString = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export const formatDid = (issuer: string) => {
  if (issuer.startsWith('did:ens')) {
    return issuer.split(':').slice(-1);
  }
  const parts = issuer.split(':');
  const didMethod = parts.slice(0, -1).join(':');
  const identifier = parts.slice(-1)[0];
  const formattedIdentifier = identifier.startsWith('0x')
    ? formatAddress(identifier)
    : identifier.length <= 8
      ? identifier
      : `${identifier.slice(0, 4)}...${identifier.slice(-4)}`;
  return `${didMethod}:${formattedIdentifier}`;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};
