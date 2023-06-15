import type {
  MascaAccountConfig,
  MascaConfig,
  MascaState, 
  MascaAccountState
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';


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
