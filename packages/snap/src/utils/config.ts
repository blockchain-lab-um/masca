import type {
  MascaAccountConfig,
  MascaAccountState,
  MascaState,
  PolygonBaseState,
  PolygonState,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyPolygonBaseState: PolygonBaseState = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonState = {
  polygonid: {
    eth: {
      main: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
  },
  iden3: {
    eth: {
      main: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
  },
};

const emptyAccountState = {
  polygonState: emptyPolygonState,
  vcs: {},
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
