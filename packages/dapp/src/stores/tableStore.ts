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

interface TableStore {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  selectedVCs: QueryCredentialsRequestResult[];
  cardView: boolean;
  dataStores: DataStore[];
  credentialTypes: CredentialType[];
  availableEcosystems: string[];
  selectedEcosystems: string[];

  setGlobalFilter: (globalFilter: string) => void;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  setSelectedVCs: (selectedVCs: QueryCredentialsRequestResult[]) => void;
  setCardView: (view: boolean) => void;
  setDataStores: (dataStores: DataStore[]) => void;
  setCredentialTypes: (credentialTypes: CredentialType[]) => void;
  setAvailableEcosystems: (availableEcosystems: string[]) => void;
  setSelectedEcosystems: (selectedEcosystems: string[]) => void;
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
  credentialTypes: [],
  availableEcosystems: ['ebsi', 'polygonid', 'other'],
  selectedEcosystems: [],
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
    setAvailableEcosystems: (availableEcosystems: string[]) =>
      set({ availableEcosystems }),
    setSelectedEcosystems: (selectedEcosystems: string[]) =>
      set({ selectedEcosystems }),
  }),
  shallow
);
