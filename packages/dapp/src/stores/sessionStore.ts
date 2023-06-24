import { create } from 'zustand';

interface SessionStore {
  sessionId: string | null;
  key: CryptoKey | null;
  exp: Date;

  changeSessionId: (sessionId: string) => void;
  changeKey: (key: CryptoKey) => void;
  changeExp: (exp: Date) => void;
}

export const sessionStoreInitialState = {
  sessionId: null,
  key: null,
  exp: new Date(),
};

export const useSessionStore = create<SessionStore>()((set) => ({
  ...sessionStoreInitialState,

  changeSessionId: (sessionId: string) => set({ sessionId }),
  changeKey: (key: CryptoKey) => set({ key }),
  changeExp: (exp: Date) => set({ exp }),
}));
