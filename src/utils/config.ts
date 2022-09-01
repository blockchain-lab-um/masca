import { SSIAccountConfig, SSISnapState } from './../interfaces';
import { SSIAccountState, SSISnapConfig } from '../interfaces';
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
      vcStore: 'snap',
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
    infuraToken: '6e751a2e5ff741e5a01eab15e4e4a88b',
    acceptedTerms: false,
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
      infuraToken: '6e751a2e5ff741e5a01eab15e4e4a88b',
      acceptedTerms: true,
    },
  },
};

export const getInitialSnapState = () => {
  return cloneDeep(initialSnapState);
};
