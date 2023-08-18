import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface QRRequest {
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
  sessionId: string | null;
  key: CryptoKey | null;
  exp: number | null;
  connected: boolean;
  deviceType: 'primary' | 'secondary' | null;
  hasCamera: boolean;
}

interface SessionStore {
  request: QRRequest;
  session: Session;
  changeRequest: (request: QRRequest) => void;
  changeSession: (session: Session) => void;
}

export const sessionStoreInitialState = {
  request: {
    type: null,
    data: null,
    active: false,
    finished: false,
  },
  session: {
    sessionId: null,
    key: null,
    exp: null,
    connected: false,
    deviceType: null,
    hasCamera: false,
  },
};

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  (set) => ({
    ...sessionStoreInitialState,
    changeRequest: (request: QRRequest) => set({ request }),
    changeSession: (session: Session) => set({ session }),
  }),
  shallow
);
