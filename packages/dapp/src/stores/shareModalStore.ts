import { VerifiableCredential } from '@veramo/core';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface ShareModalStore {
  isOpen: boolean;
  mode: string;
  credentials: VerifiableCredential[];

  setMode: (mode: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setCredentials: (credentials: VerifiableCredential[]) => void;
}

export const shareModalStoreInitialState = {
  isOpen: false,
  mode: 'single',
  credentials: [],
};

export const useShareModalStore = createWithEqualityFn<ShareModalStore>()(
  (set) => ({
    ...shareModalStoreInitialState,
    setMode: (mode: string) => set({ mode }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setCredentials: (credentials: VerifiableCredential[]) =>
      set({ credentials }),
  }),
  shallow
);
