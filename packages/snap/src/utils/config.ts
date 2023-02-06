import {
  SSIAccountConfig,
  SSISnapConfig,
} from '@blockchain-lab-um/ssi-snap-types';
import cloneDeep from 'lodash.clonedeep';
import { SSISnapState, SSIAccountState } from '../interfaces';

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
        ceramic: true,
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
      acceptedTerms: true,
    },
  },
};

export const getInitialSnapState = () => {
  return cloneDeep(initialSnapState);
};
