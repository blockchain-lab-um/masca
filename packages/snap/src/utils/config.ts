import type {
  MascaAccountConfig,
  MascaAccountState,
  MascaConfig,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyAccountState = {
  polygonState: {
    credentials: {},
    identities: {},
    profiles: {},
    merkleTreeMeta: [],
    merkleTree: {},
    keystore: {},
  },
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
  } as MascaAccountConfig,
} as MascaAccountState;

export const getEmptyAccountState = () => cloneDeep(emptyAccountState);

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

export const getInitialSnapState = () => cloneDeep(initialSnapState);
