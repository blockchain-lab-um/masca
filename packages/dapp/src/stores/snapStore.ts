import {
  AvailableVCStores,
  MascaApi,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { create } from 'zustand';

interface MascaStore {
  mascaApi: MascaApi | undefined;
  availableMethods: string[];
  currDIDMethod: string | undefined;
  currVCStore: AvailableVCStores | undefined;
  currDID: string;
  vcs: QueryVCsRequestResult[];
  availableVCStores: Record<string, boolean>;
  lastFetch: number | undefined;
  popups: boolean | undefined;

  changeAvailableVCStores: (availableVCStores: Record<string, boolean>) => void;
  changeMascaApi: (mascaApi: MascaApi) => void;
  changeAvailableMethods: (availableMethods: string[]) => void;
  changeCurrDIDMethod: (currDIDMethod: string) => void;
  changeCurrVCStore: (currVCStore: AvailableVCStores) => void;
  changeCurrDID: (currDID: string) => void;
  changeVcs: (vcs: QueryVCsRequestResult[]) => void;
  changeLastFetch: (lastFetch: number) => void;
  changePopups: (enabled: boolean) => void;
}

export const mascaStoreInitialState = {
  mascaApi: undefined,
  availableMethods: [],
  currDIDMethod: undefined,
  currVCStore: undefined,
  currDID: '',
  vcs: [],
  availableVCStores: { snap: true, ceramic: true },
  lastFetch: undefined,
  popups: undefined,
};

export const useMascaStore = create<MascaStore>()((set) => ({
  ...mascaStoreInitialState,

  changeAvailableVCStores: (availableVCStores: Record<string, boolean>) =>
    set({ availableVCStores }),
  changeMascaApi: (mascaApi: MascaApi) => set({ mascaApi }),
  changeAvailableMethods: (availableMethods: string[]) =>
    set({ availableMethods }),
  changeCurrDIDMethod: (currDIDMethod: string) => set({ currDIDMethod }),
  changeCurrVCStore: (currVCStore: AvailableVCStores) => set({ currVCStore }),
  changeCurrDID: (currDID: string) => set({ currDID }),
  changeVcs: (vcs: QueryVCsRequestResult[]) => set({ vcs }),
  changeLastFetch: (lastFetch: number) => set({ lastFetch }),
  changePopups: (enabled: boolean) => set({ popups: enabled }),
}));
