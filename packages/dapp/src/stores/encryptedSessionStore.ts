import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface EncryptedRequest {
  type:
    | 'polygonAuth'
    | 'oidcAuth'
    | 'credentialOffer'
    | 'polygonCredentialOffer'
    | null;
  data: string | null;
  active: boolean;
  finished: boolean;
}

interface Session {
  key: CryptoKey | null;
  exp: number | null;
}

interface EncryptedSessionStore {
  sessionId: string | null;
  request: EncryptedRequest;
  session: Session;
  connected: boolean;
  deviceType: 'primary' | 'secondary' | null;
  hasCamera: boolean;

  changeSessionId: (sessionId: string | null) => void;
  changeRequest: (request: EncryptedRequest) => void;
  changeSession: (session: Session) => void;
  changeConnected: (connected: boolean) => void;
  changeDeviceType: (deviceType: 'primary' | 'secondary') => void;
  changeHasCamera: (hasCamera: boolean) => void;
}

export const encryptedSessionInitialState = {
  sessionId: null,
  request: {
    type: null,
    data: null,
    active: false,
    finished: false,
  },
  session: {
    key: null,
    exp: null,
  },
  connected: false,
  deviceType: null,
  hasCamera: false,
};

export const useEncryptedSessionStore =
  createWithEqualityFn<EncryptedSessionStore>()(
    (set) => ({
      ...encryptedSessionInitialState,
      changeSessionId: (sessionId: string | null) => set({ sessionId }),
      changeRequest: (request: EncryptedRequest) => set({ request }),
      changeSession: (session: Session) => set({ session }),
      changeConnected: (connected: boolean) => set({ connected }),
      changeDeviceType: (deviceType: 'primary' | 'secondary') =>
        set({ deviceType }),
      changeHasCamera: (hasCamera: boolean) => set({ hasCamera }),
    }),
    shallow
  );
