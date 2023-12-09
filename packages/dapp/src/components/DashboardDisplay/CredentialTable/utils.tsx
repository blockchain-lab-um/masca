import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { SortDescriptor } from '@nextui-org/react';

import { convertTypes } from '@/utils/string';
import { ColumnFilter, CredentialType, DataStore, Ecosystem } from '@/stores';

const compareFunction = (
  column: string,
  direction: 'ascending' | 'descending'
) => {
  switch (column) {
    case 'type':
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => {
        const typeA = convertTypes(a.data.type).split(',')[0];
        const typeB = convertTypes(b.data.type).split(',')[0];

        if (direction === 'descending') {
          return typeA.localeCompare(typeB);
        }
        return typeB.localeCompare(typeA);
      };
    case 'date':
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => {
        const dateA = a.data.issuanceDate;
        const dateB = b.data.issuanceDate;

        if (direction === 'descending') {
          return dateB > dateA ? 1 : -1;
        }
        return dateA > dateB ? 1 : -1;
      };
    case 'subject':
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => {
        const subjectA = a.data.credentialSubject.id
          ? a.data.credentialSubject.id
          : '';
        const subjectB = b.data.credentialSubject.id
          ? b.data.credentialSubject.id
          : '';

        if (direction === 'descending') {
          return subjectA.localeCompare(subjectB);
        }
        return subjectB.localeCompare(subjectA);
      };
    case 'issuer':
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => {
        let issuerA;
        if (!a.data.issuer) issuerA = '';
        else if (typeof a.data.issuer === 'string') issuerA = a.data.issuer;
        else issuerA = a.data.issuer.id ? a.data.issuer.id : '';

        let issuerB;
        if (!b.data.issuer) issuerB = '';
        else if (typeof b.data.issuer === 'string') issuerB = b.data.issuer;
        else issuerB = b.data.issuer.id ? b.data.issuer.id : '';

        if (direction === 'descending') {
          return issuerA.localeCompare(issuerB);
        }
        return issuerB.localeCompare(issuerA);
      };
    case 'exp_date':
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => {
        const dateA = a.data.expirationDate;
        const dateB = b.data.expirationDate;

        if (direction === 'descending') {
          return dateB > dateA ? 1 : -1;
        }
        return dateA > dateB ? 1 : -1;
      };
    default:
      return (
        a: QueryCredentialsRequestResult,
        b: QueryCredentialsRequestResult
      ) => 1;
  }
};

export const sortCredentialList = (
  sortDesc: SortDescriptor,
  credentialList: QueryCredentialsRequestResult[]
) => {
  const { column, direction } = sortDesc;
  return credentialList.sort(compareFunction(column as string, direction!));
};

export const filterColumnsDataStore = (
  credentialList: QueryCredentialsRequestResult[],
  dataStores: DataStore[]
) => {
  console.log('filtering Columns DS...');
  const availableDataStores = dataStores
    .filter((ds) => ds.selected)
    .map((ds) => ds.dataStore);
  const filteredList = credentialList.filter((credential) => {
    const dataStore = credential.metadata.store;
    if (!dataStore) return false;

    for (const val of dataStore) {
      if (availableDataStores.includes(val)) return true;
    }
    return false;
  });
  return filteredList;
};

export const filterColumnsType = (
  credentialList: QueryCredentialsRequestResult[],
  types: CredentialType[]
) => {
  console.log('filtering Columns Type...');
  const availableTypes = types
    .filter((type) => type.selected)
    .map((type) => type.type);
  const filteredList = credentialList.filter((credential) => {
    const { type } = credential.data;
    if (!type) return false;

    for (const typ of availableTypes) {
      if (
        (typeof type === 'string' && type === typ) ||
        (Array.isArray(type) && type.indexOf(typ) >= 0)
      ) {
        return true;
      }
    }
    return false;
  });
  return filteredList;
  return credentialList;
};

export const filterColumnsEcosystem = (
  credentialList: QueryCredentialsRequestResult[],
  types: Ecosystem[]
) => {
  console.log('filtering Columns ECO...');
  return credentialList;
};
