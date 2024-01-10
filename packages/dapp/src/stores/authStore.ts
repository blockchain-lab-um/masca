import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface AuthStore {
  isSignedIn: boolean;
  token: string | null;
  isSignInModalOpen: boolean;

  changeToken: (token: string) => void;
  changeIsSignedIn: (isSignedIn: boolean) => void;
  changeIsSignInModalOpen: (isSignInModalOpen: boolean) => void;
}

export const authStoreInitialState = {
  isSignedIn: false,
  token: null,
  isSignInModalOpen: false,
};

export const useAuthStore = createWithEqualityFn<AuthStore>()(
  (set) => ({
    ...authStoreInitialState,

    changeToken: (token: string) => set({ token }),
    changeIsSignedIn: (isSignedIn: boolean) => set({ isSignedIn }),
    changeIsSignInModalOpen: (isSignInModalOpen: boolean) =>
      set({ isSignInModalOpen }),
  }),
  shallow
);
