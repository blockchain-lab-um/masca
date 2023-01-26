import { create } from 'zustand';
import {
  AvailableMethods,
  AvailableVCStores,
  SSISnapApi,
} from '@blockchain-lab-um/ssi-snap-types';

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
  isConnected: false,
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
  changeSnapApi: (snapApi: SSISnapApi) => void;
  changeAvailableMethods: (availableMethods: string[]) => void;
  changeCurrDIDMethod: (currDIDMethod: string) => void;
  changeCurrVCStore: (currVCStore: AvailableVCStores) => void;
  changeCurrDID: (currDID: string) => void;
}

export const useSnapStore = create<SnapStore>()((set) => ({
  snapApi: undefined,
  availableMethods: [],
  currDIDMethod: undefined,
  currVCStore: undefined,
  currDID: '',
  changeSnapApi: (snapApi: SSISnapApi) => set({ snapApi }),
  changeAvailableMethods: (availableMethods: string[]) =>
    set({ availableMethods }),
  changeCurrDIDMethod: (currDIDMethod: string) => set({ currDIDMethod }),
  changeCurrVCStore: (currVCStore: AvailableVCStores) => set({ currVCStore }),
  changeCurrDID: (currDID: string) => set({ currDID }),
}));
