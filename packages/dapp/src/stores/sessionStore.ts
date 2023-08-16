import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface SessionStore {
  sessionId: string | null;
  key: CryptoKey | null;
  exp: number | null;
  connected: boolean;

  changeSessionId: (sessionId: string) => void;
  changeKey: (key: CryptoKey) => void;
  changeExp: (exp: number) => void;
  changeConnected: (connected: boolean) => void;
}

export const sessionStoreInitialState = {
  sessionId: null,
  key: null,
  exp: null,
  connected: false,
};

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  (set) => ({
    ...sessionStoreInitialState,

    changeSessionId: (sessionId: string) => set({ sessionId }),
    changeKey: (key: CryptoKey) => set({ key }),
    changeExp: (exp: number) => set({ exp }),
    changeConnected: (connected: boolean) => set({ connected }),
  }),
  shallow
);
