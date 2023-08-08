import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface SessionStore {
  sessionId: string | null;
  key: CryptoKey | null;
  exp: number | null;

  changeSessionId: (sessionId: string) => void;
  changeKey: (key: CryptoKey) => void;
  changeExp: (exp: number) => void;
}

export const sessionStoreInitialState = {
  sessionId: null,
  key: null,
  exp: null,
};

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  (set) => ({
    ...sessionStoreInitialState,

    changeSessionId: (sessionId: string) => set({ sessionId }),
    changeKey: (key: CryptoKey) => set({ key }),
    changeExp: (exp: number) => set({ exp }),
  }),
  shallow
);
