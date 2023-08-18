import { VerifiableCredential } from '@veramo/core';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface SessionStore {
  sessionId: string | null;
  key: CryptoKey | null;
  exp: number | null;
  connected: boolean;
  recievedCredential: boolean;
  recievedCredentialOffer: boolean;
  polygonAuthRequest: boolean;
  oidcAuthRequest: boolean;
  decryptedData: string | null;
  authData: string | null;
  credential: VerifiableCredential | null;

  changeSessionId: (sessionId: string) => void;
  changeKey: (key: CryptoKey) => void;
  changeExp: (exp: number) => void;
  changeConnected: (connected: boolean) => void;
  changeRecievedCredential: (recievedCredential: boolean) => void;
  changeRecievedCredentialOffer: (recievedCredentialOffer: boolean) => void;
  changePolygonAuthRequest: (polygonAuthRequest: boolean) => void;
  changeOidcAuthRequest: (oidcAuthRequest: boolean) => void;
  changeDecryptedData: (decryptedData: string | null) => void;
  changeAuthData: (authData: string | null) => void;
  changeCredential(credential: VerifiableCredential | null): void;
}

export const sessionStoreInitialState = {
  sessionId: null,
  key: null,
  exp: null,
  connected: false,
  recievedCredential: false,
  recievedCredentialOffer: false,
  polygonAuthRequest: false,
  oidcAuthRequest: false,
  decryptedData: null,
  authData: null,
  credential: null,
};

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  (set) => ({
    ...sessionStoreInitialState,

    changeSessionId: (sessionId: string) => set({ sessionId }),
    changeKey: (key: CryptoKey) => set({ key }),
    changeExp: (exp: number) => set({ exp }),
    changeConnected: (connected: boolean) => set({ connected }),
    changeRecievedCredential: (recievedCredential: boolean) =>
      set({ recievedCredential }),
    changeRecievedCredentialOffer: (recievedCredentialOffer: boolean) =>
      set({ recievedCredentialOffer }),
    changePolygonAuthRequest: (polygonAuthRequest: boolean) =>
      set({ polygonAuthRequest }),
    changeOidcAuthRequest: (oidcAuthRequest: boolean) =>
      set({ oidcAuthRequest }),
    changeDecryptedData: (decryptedData: string | null) =>
      set({ decryptedData }),
    changeAuthData: (authData: string | null) => set({ authData }),
    changeCredential: (credential: VerifiableCredential | null) =>
      set({ credential }),
  }),
  shallow
);
