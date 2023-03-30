import { create } from 'zustand';

interface GeneralStore {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  did: string;
  hasMetaMask: boolean;
  isFlask: boolean;
  hasSnapInstalled: boolean;

  changeAddress: (address: string) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsConnecting: (isConnecting: boolean) => void;
  changeDid: (did: string) => void;
  changeHasMetaMask: (hasMetaMask: boolean) => void;
  changeIsFlask: (isFlask: boolean) => void;
  changeHasSnapInstalled: (hasSnapInstalled: boolean) => void;
}

export const useGeneralStore = create<GeneralStore>()((set) => ({
  address: '',
  isConnected: false,
  isConnecting: false,
  did: '',
  hasMetaMask: false,
  isFlask: false,
  hasSnapInstalled: false,

  changeAddress: (address: string) => set({ address }),
  changeIsConnected: (isConnected: boolean) => set({ isConnected }),
  changeIsConnecting: (isConnecting: boolean) => set({ isConnecting }),
  changeDid: (did: string) => set({ did }),
  changeHasMetaMask: (hasMetaMask: boolean) => set({ hasMetaMask }),
  changeIsFlask: (isFlask: boolean) => set({ isFlask }),
  changeHasSnapInstalled: (hasSnapInstalled: boolean) =>
    set({ hasSnapInstalled }),
}));
