import {
  AvailableCredentialStores,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { ColumnFiltersState } from '@tanstack/react-table';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DataStore {
  dataStore: AvailableCredentialStores;
  selected: boolean;
}

interface CredentialType {
  type: string;
  selected: boolean;
}

interface Ecosystem {
  ecosystem: 'ebsi' | 'polygonid' | 'other';
  selected: boolean;
}

interface TableStore {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  selectedVCs: QueryCredentialsRequestResult[];
  cardView: boolean;
  dataStores: DataStore[];
  ecosystems: Ecosystem[];
  credentialTypes: CredentialType[];

  setGlobalFilter: (globalFilter: string) => void;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  setSelectedVCs: (selectedVCs: QueryCredentialsRequestResult[]) => void;
  setCardView: (view: boolean) => void;
  setDataStores: (dataStores: DataStore[]) => void;
  setCredentialTypes: (credentialTypes: CredentialType[]) => void;
  setEcosystems: (ecosystems: Ecosystem[]) => void;
}

export const tableStoreInitialState = {
  globalFilter: '',
  columnFilters: [
    { id: 'data_store', value: ['snap'] },
    // { id: 'type', value: [] },
  ],
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
    setColumnFilters: (columnFilters: ColumnFiltersState) =>
      set({ columnFilters }),
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
