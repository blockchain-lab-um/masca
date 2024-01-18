import { MetaMaskInpageProvider } from '@metamask/providers';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GeneralStore {
  did: string;
  chainId: string;
  supportsSnaps: boolean;
  provider: MetaMaskInpageProvider | null;

  changeDid: (did: string) => void;
  changeChainId: (chainId: string) => void;
  changeSupportsSnaps: (supportsSnaps: boolean) => void;
  changeProvider: (provider: MetaMaskInpageProvider) => void;
}

export const generalStoreInitialState = {
  did: '',
  chainId: '',
  supportsSnaps: false,
  provider: null,
};

export const useGeneralStore = createWithEqualityFn<GeneralStore>()(
  (set) => ({
    ...generalStoreInitialState,

    changeDid: (did: string) => set({ did }),
    changeChainId: (chainId: string) => set({ chainId }),
    changeSupportsSnaps: (supportsSnaps: boolean) => set({ supportsSnaps }),
    changeProvider: (provider: MetaMaskInpageProvider) => set({ provider }),
  }),
  shallow
);
