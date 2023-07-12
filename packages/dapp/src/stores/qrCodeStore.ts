import { create } from 'zustand';

interface QRCodeStore {
  requestData: string | null;
  changeRequestData: (requestData: string) => void;
}

export const qrCodeStoreInitialState = {
  requestData: null,
};

export const useQRCodeStore = create<QRCodeStore>()((set) => ({
  ...qrCodeStoreInitialState,

  changeRequestData: (requestData: string) => set({ requestData }),
}));
