import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GeneralStore {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  did: string;
  hasMetaMask: boolean;
  isFlask: boolean;
  hasSnapInstalled: boolean;
  chainId: string;

  changeAddress: (address: string) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsConnecting: (isConnecting: boolean) => void;
  changeDid: (did: string) => void;
  changeHasMetaMask: (hasMetaMask: boolean) => void;
  changeIsFlask: (isFlask: boolean) => void;
  changeHasSnapInstalled: (hasSnapInstalled: boolean) => void;
  changeChainId: (chainId: string) => void;
}

export const generalStoreInitialState = {
  address: '',
  isConnected: false,
  isConnecting: false,
  did: '',
  hasMetaMask: false,
  isFlask: false,
  hasSnapInstalled: false,
  chainId: '',
};

export const useGeneralStore = createWithEqualityFn<GeneralStore>()(
  (set) => ({
    ...generalStoreInitialState,

    changeAddress: (address: string) => set({ address }),
    changeIsConnected: (isConnected: boolean) => set({ isConnected }),
    changeIsConnecting: (isConnecting: boolean) => set({ isConnecting }),
    changeDid: (did: string) => set({ did }),
    changeHasMetaMask: (hasMetaMask: boolean) => set({ hasMetaMask }),
    changeIsFlask: (isFlask: boolean) => set({ isFlask }),
    changeHasSnapInstalled: (hasSnapInstalled: boolean) =>
      set({ hasSnapInstalled }),
    changeChainId: (chainId: string) => set({ chainId }),
  }),
  shallow
);
