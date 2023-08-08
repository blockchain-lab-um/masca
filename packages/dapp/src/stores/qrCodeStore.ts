import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface QRCodeStore {
  requestData: string | null;
  changeRequestData: (requestData: string) => void;
}

export const qrCodeStoreInitialState = {
  requestData: null,
};

export const useQRCodeStore = createWithEqualityFn<QRCodeStore>()(
  (set) => ({
    ...qrCodeStoreInitialState,

    changeRequestData: (requestData: string) => set({ requestData }),
  }),
  shallow
);
