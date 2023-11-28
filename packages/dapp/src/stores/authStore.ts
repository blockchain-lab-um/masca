import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface AuthStore {
  isSignedIn: boolean;
  token: string | null;
  changeToken: (token: string) => void;
  changeIsSignedIn: (isSignedIn: boolean) => void;
}

export const authStoreInitialState = {
  isSignedIn: false,
  token: null,
};

export const useAuthStore = createWithEqualityFn<AuthStore>()(
  (set) => ({
    ...authStoreInitialState,

    changeToken: (token: string) => set({ token }),
    changeIsSignedIn: (isSignedIn: boolean) => set({ isSignedIn }),
  }),
  shallow
);
