import {
  AvailableCredentialStores,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export interface DataStore {
  dataStore: AvailableCredentialStores;
  selected: boolean;
}

export interface CredentialType {
  type: string;
  selected: boolean;
}

export interface Ecosystem {
  ecosystem: 'ebsi' | 'polygonid' | 'other';
  selected: boolean;
}

export interface ColumnFilter {
  id: 'data_store' | 'issuer' | 'type';
  value: string[];
}

interface TableStore {
  globalFilter: string;
  selectedVCs: QueryCredentialsRequestResult[];
  cardView: boolean;
  dataStores: DataStore[];
  ecosystems: Ecosystem[];
  credentialTypes: CredentialType[];

  setGlobalFilter: (globalFilter: string) => void;
  setSelectedVCs: (selectedVCs: QueryCredentialsRequestResult[]) => void;
  setCardView: (view: boolean) => void;
  setDataStores: (dataStores: DataStore[]) => void;
  setCredentialTypes: (credentialTypes: CredentialType[]) => void;
  setEcosystems: (ecosystems: Ecosystem[]) => void;
}

export const tableStoreInitialState = {
  globalFilter: '',
  selectedVCs: [],
  cardView: true,
  dataStores: [
    { dataStore: 'snap', selected: true } as DataStore,
    { dataStore: 'ceramic', selected: true } as DataStore,
  ],
  ecosystems: [
    { ecosystem: 'ebsi', selected: true } as Ecosystem,
    { ecosystem: 'polygonid', selected: true } as Ecosystem,
    { ecosystem: 'other', selected: true } as Ecosystem,
  ],
  credentialTypes: [],
};

export const useTableStore = createWithEqualityFn<TableStore>()(
  (set) => ({
    ...tableStoreInitialState,

    setGlobalFilter: (globalFilter: string) => set({ globalFilter }),
    setCardView: (cardView: boolean) => set({ cardView }),
    setSelectedVCs: (selectedVCs: QueryCredentialsRequestResult[]) =>
      set({ selectedVCs }),
    setDataStores: (dataStores: DataStore[]) => set({ dataStores }),
    setCredentialTypes: (credentialTypes: CredentialType[]) =>
      set({ credentialTypes }),

    setEcosystems: (ecosystems: Ecosystem[]) => set({ ecosystems }),
  }),
  shallow
);
