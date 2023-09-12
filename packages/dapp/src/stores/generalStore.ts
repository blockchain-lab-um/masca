import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GeneralStore {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  did: string;
  hasMetaMask: boolean;
  hasSnapInstalled: boolean;
  chainId: string;
  supportsSnaps: boolean;

  changeAddress: (address: string) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsConnecting: (isConnecting: boolean) => void;
  changeDid: (did: string) => void;
  changeHasMetaMask: (hasMetaMask: boolean) => void;
  changeHasSnapInstalled: (hasSnapInstalled: boolean) => void;
  changeChainId: (chainId: string) => void;
  changeSupportsSnaps: (supportsSnaps: boolean) => void;
}

export const generalStoreInitialState = {
  address: '',
  isConnected: false,
  isConnecting: false,
  did: '',
  hasMetaMask: false,
  hasSnapInstalled: false,
  chainId: '',
  supportsSnaps: false,
};

export const useGeneralStore = createWithEqualityFn<GeneralStore>()(
  (set) => ({
    ...generalStoreInitialState,

    changeAddress: (address: string) => set({ address }),
    changeIsConnected: (isConnected: boolean) => set({ isConnected }),
    changeIsConnecting: (isConnecting: boolean) => set({ isConnecting }),
    changeDid: (did: string) => set({ did }),
    changeHasMetaMask: (hasMetaMask: boolean) => set({ hasMetaMask }),
    changeHasSnapInstalled: (hasSnapInstalled: boolean) =>
      set({ hasSnapInstalled }),
    changeChainId: (chainId: string) => set({ chainId }),
    changeSupportsSnaps: (supportsSnaps: boolean) => set({ supportsSnaps }),
  }),
  shallow
);
