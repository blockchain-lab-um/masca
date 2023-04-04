import {
  AvailableVCStores,
  QueryVCsRequestResult,
  SSISnapApi,
} from '@blockchain-lab-um/masca-types';
import { create } from 'zustand';

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
  availableMethods: [],
  currDIDMethod: undefined,
  currVCStore: undefined,
  currDID: '',
  vcs: [],
  availableVCStores: { snap: true, ceramic: false },

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
