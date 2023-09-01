import {
  type AvailableCredentialStores,
  type MascaApi,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface MascaStore {
  mascaApi: MascaApi | undefined;
  availableMethods: string[];
  currDIDMethod: string | undefined;
  currCredentialStore: AvailableCredentialStores | undefined;
  currDID: string;
  vcs: QueryCredentialsRequestResult[];
  availableCredentialStores: Record<string, boolean>;
  lastFetch: number | undefined;
  popups: boolean | undefined;
  isSignedInGoogle: boolean;

  changeAvailableCredentialStores: (
    availableCredentialStores: Record<string, boolean>
  ) => void;
  changeMascaApi: (mascaApi: MascaApi) => void;
  changeAvailableMethods: (availableMethods: string[]) => void;
  changeCurrDIDMethod: (currDIDMethod: string) => void;
  changeCurrCredentialStore: (
    currCredentialStore: AvailableCredentialStores
  ) => void;
  changeCurrDID: (currDID: string) => void;
  changeVcs: (vcs: QueryCredentialsRequestResult[]) => void;
  changeLastFetch: (lastFetch: number) => void;
  changePopups: (enabled: boolean) => void;
  changeIsSignedInGoogle: (isSignedInGoogle: boolean) => void;
}

export const mascaStoreInitialState = {
  mascaApi: undefined,
  availableMethods: [],
  currDIDMethod: undefined,
  currCredentialStore: undefined,
  currDID: '',
  vcs: [],
  availableCredentialStores: { snap: true, ceramic: true },
  lastFetch: undefined,
  popups: undefined,
  isSignedInGoogle: false,
};

export const useMascaStore = createWithEqualityFn<MascaStore>()(
  (set) => ({
    ...mascaStoreInitialState,

    changeAvailableCredentialStores: (
      availableCredentialStores: Record<string, boolean>
    ) => set({ availableCredentialStores }),
    changeMascaApi: (mascaApi: MascaApi) => set({ mascaApi }),
    changeAvailableMethods: (availableMethods: string[]) =>
      set({ availableMethods }),
    changeCurrDIDMethod: (currDIDMethod: string) => set({ currDIDMethod }),
    changeCurrCredentialStore: (
      currCredentialStore: AvailableCredentialStores
    ) => set({ currCredentialStore }),
    changeCurrDID: (currDID: string) => set({ currDID }),
    changeVcs: (vcs: QueryCredentialsRequestResult[]) => set({ vcs }),
    changeLastFetch: (lastFetch: number) => set({ lastFetch }),
    changePopups: (enabled: boolean) => set({ popups: enabled }),
    changeIsSignedInGoogle: (isSignedInGoogle: boolean) =>
      set({ isSignedInGoogle }),
  }),
  shallow
);
