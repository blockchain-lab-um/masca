import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GeneralStore {
  did: string;
  supportsSnaps: boolean;

  changeDid: (did: string) => void;
  changeSupportsSnaps: (supportsSnaps: boolean) => void;
}

export const generalStoreInitialState = {
  did: '',
  supportsSnaps: false,
};

export const useGeneralStore = createWithEqualityFn<GeneralStore>()(
  (set) => ({
    ...generalStoreInitialState,

    changeDid: (did: string) => set({ did }),
    changeSupportsSnaps: (supportsSnaps: boolean) => set({ supportsSnaps }),
  }),
  shallow
);
