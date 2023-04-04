import {
  MascaAccountConfig,
  MascaConfig,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

import { MascaAccountState, MascaState } from '../interfaces';

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
  } as MascaAccountConfig,
} as MascaAccountState;

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
} as MascaConfig;

const initialSnapState: MascaState = {
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
