import { MetaMaskInpageProvider } from '@metamask/providers';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GeneralStore {
  isConnected: boolean;
  isConnecting: boolean;
  did: string;
  hasMetaMask: boolean;
  chainId: string;
  supportsSnaps: boolean;
  provider: MetaMaskInpageProvider | null;

  changeIsConnected: (isConnected: boolean) => void;
  changeIsConnecting: (isConnecting: boolean) => void;
  changeDid: (did: string) => void;
  changeHasMetaMask: (hasMetaMask: boolean) => void;
  changeChainId: (chainId: string) => void;
  changeSupportsSnaps: (supportsSnaps: boolean) => void;
  changeProvider: (provider: MetaMaskInpageProvider) => void;
}

export const generalStoreInitialState = {
  isConnected: false,
  isConnecting: false,
  did: '',
  hasMetaMask: false,
  chainId: '',
  supportsSnaps: false,
  provider: null,
};

export const useGeneralStore = createWithEqualityFn<GeneralStore>()(
  (set) => ({
    ...generalStoreInitialState,

    changeIsConnected: (isConnected: boolean) => set({ isConnected }),
    changeIsConnecting: (isConnecting: boolean) => set({ isConnecting }),
    changeDid: (did: string) => set({ did }),
    changeHasMetaMask: (hasMetaMask: boolean) => set({ hasMetaMask }),
    changeChainId: (chainId: string) => set({ chainId }),
    changeSupportsSnaps: (supportsSnaps: boolean) => set({ supportsSnaps }),
    changeProvider: (provider: MetaMaskInpageProvider) => set({ provider }),
  }),
  shallow
);
