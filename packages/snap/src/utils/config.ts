import type {
  MascaAccountConfig,
  MascaConfig,
} from '@blockchain-lab-um/masca-types';

import type { MascaAccountState, MascaState } from '../interfaces';

const emptyAccountState = {
  snapKeyStore: {},
  snapPrivateKeyStore: {},
  vcs: {},
  identifiers: {},
  publicKey: '',
  accountConfig: {
    ssi: {
      didMethod: 'did:ethr',
      vcStore: {
        snap: true,
        ceramic: true,
      },
    },
    ceramic: {},
  } as MascaAccountConfig,
} as MascaAccountState;

export const getEmptyAccountState = () => {
  return structuredClone(emptyAccountState);
};

export const defaultConfig = {
  dApp: {
    disablePopups: false,
    friendlyDapps: [],
  },
  snap: {
    acceptedTerms: true,
  },
} as MascaConfig;

const initialSnapState: MascaState = {
  accountState: {},
  currentAccount: '',
  snapConfig: {
    dApp: {
      disablePopups: false,
      friendlyDapps: [],
    },
    snap: {
      acceptedTerms: true,
    },
  },
};

export const getInitialSnapState = () => {
  return structuredClone(initialSnapState);
};
