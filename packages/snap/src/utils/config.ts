import { SSIAccountConfig, SSISnapState } from './../interfaces';
import { SSIAccountState, SSISnapConfig } from '../interfaces';
import cloneDeep from 'lodash.clonedeep';

const emptyAccountState = {
  snapKeyStore: {},
  snapPrivateKeyStore: {},
  vcs: {},
  identifiers: {},
  index: 0,
  publicKey: '',
  accountConfig: {
    ssi: {
      didMethod: 'did:ethr',
      vcStore: {
        snap: true,
        ceramic: false,
      },
    },
    ceramic: {},
  } as SSIAccountConfig,
} as SSIAccountState;

export const getEmptyAccountState = () => {
  return cloneDeep(emptyAccountState);
};

export const defaultConfig = {
  dApp: {
    disablePopups: false,
    friendlyDapps: [],
  },
  snap: {
    infuraToken: '0ec03090465d400c988a14831aacfe37',
    acceptedTerms: true,
  },
} as SSISnapConfig;

const initialSnapState: SSISnapState = {
  accountState: {},
  snapConfig: {
    dApp: {
      disablePopups: false,
      friendlyDapps: [],
    },
    snap: {
      infuraToken: '0ec03090465d400c988a14831aacfe37',
      acceptedTerms: true,
    },
  },
};

export const getInitialSnapState = () => {
  return cloneDeep(initialSnapState);
};
