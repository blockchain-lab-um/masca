// eslint-disable-next-line import/no-extraneous-dependencies
import { W3CVerifiableCredential } from '@veramo/core';
import { create } from 'zustand';
import {
  QueryVCsRequestResult,
  AvailableVCStores,
  SSISnapApi,
} from '@blockchain-lab-um/ssi-snap-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ColumnFiltersState, RowModel, Table } from '@tanstack/react-table';
import { VC_DATA } from 'src/components/VCTable/data';

interface GeneralStore {
  address: string;
  isConnected: boolean;
  did: string;
  hasMetaMask: boolean;
  isFlask: boolean;
  hasSnapInstalled: boolean;
  changeAddress: (address: string) => void;
  changeDid: (did: string) => void;
  changeHasMetaMask: (hasMetaMask: boolean) => void;
  changeIsFlask: (isFlask: boolean) => void;
  changeHasSnapInstalled: (hasSnapInstalled: boolean) => void;
  changeIsConnected: (isConnected: boolean) => void;
}

export const useGeneralStore = create<GeneralStore>()((set) => ({
  address: '',
  isConnected: true,
  did: '',
  hasMetaMask: false,
  isFlask: false,
  hasSnapInstalled: false,
  changeAddress: (address: string) => set({ address }),
  changeDid: (did: string) => set({ did }),
  changeHasMetaMask: (hasMetaMask: boolean) => set({ hasMetaMask }),
  changeIsFlask: (isFlask: boolean) => set({ isFlask }),
  changeHasSnapInstalled: (hasSnapInstalled: boolean) =>
    set({ hasSnapInstalled }),
  changeIsConnected: (isConnected: boolean) => set({ isConnected }),
}));

interface SnapStore {
  snapApi: SSISnapApi | undefined;
  availableMethods: string[];
  currDIDMethod: string | undefined;
  currVCStore: AvailableVCStores | undefined;
  currDID: string;
  vcs: QueryVCsRequestResult[];
  availableVCStores: Record<string, boolean>;
  changeAvailableVCStores: (availableVCStores: Record<string, boolean>) => void;
  changeSnapApi: (snapApi: SSISnapApi) => void;
  changeAvailableMethods: (availableMethods: string[]) => void;
  changeCurrDIDMethod: (currDIDMethod: string) => void;
  changeCurrVCStore: (currVCStore: AvailableVCStores) => void;
  changeCurrDID: (currDID: string) => void;
  changeVcs: (vcs: QueryVCsRequestResult[]) => void;
}

export const useSnapStore = create<SnapStore>()((set) => ({
  snapApi: undefined,
  availableMethods: ['did:ethr', 'did:key'],
  currDIDMethod: undefined,
  currVCStore: undefined,
  currDID: '',
  vcs: VC_DATA,
  availableVCStores: { snap: true, ceramic: true },
  changeAvailableVCStores: (availableVCStores: Record<string, boolean>) =>
    set({ availableVCStores }),
  changeSnapApi: (snapApi: SSISnapApi) => set({ snapApi }),
  changeAvailableMethods: (availableMethods: string[]) =>
    set({ availableMethods }),
  changeCurrDIDMethod: (currDIDMethod: string) => set({ currDIDMethod }),
  changeCurrVCStore: (currVCStore: AvailableVCStores) => set({ currVCStore }),
  changeCurrDID: (currDID: string) => set({ currDID }),
  changeVcs: (vcs: QueryVCsRequestResult[]) => set({ vcs }),
}));

interface TableStore {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  selectedVCs: QueryVCsRequestResult[];
  cardView: boolean;
  setCardView: (view: boolean) => void;
  setSelectedVCs: (selectedVCs: QueryVCsRequestResult[]) => void;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  setGlobalFilter: (globalFilter: string) => void;
}

export const useTableStore = create<TableStore>()((set) => ({
  globalFilter: '',
  columnFilters: [{ id: 'data_store', value: ['snap', 'ceramic'] }],
  selectedVCs: [],
  cardView: true,
  setCardView: (cardView: boolean) => set({ cardView }),
  setSelectedVCs: (selectedVCs: QueryVCsRequestResult[]) =>
    set({ selectedVCs }),
  setColumnFilters: (columnFilters: ColumnFiltersState) =>
    set({ columnFilters }),
  setGlobalFilter: (globalFilter: string) => set({ globalFilter }),
}));
