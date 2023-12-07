import type {
  MascaAccountConfig,
  MascaAccountState,
  MascaState,
  PolygonBaseState,
  PolygonState,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

export const UNIRESOLVER_PROXY_URL = 'https://masca.io/api/proxy/uniresolver';

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
  polygon: {
    state: emptyPolygonState,
  },
  veramo: {
    credentials: {},
  },
  general: {
    account: {
      ssi: {
        selectedMethod: 'did:ethr',
        storesEnabled: {
          snap: true,
          ceramic: true,
        },
      },
    } as MascaAccountConfig,
  },
} as MascaAccountState;

export const getEmptyAccountState = () => cloneDeep(emptyAccountState);

const initialSnapState: MascaState = {
  v1: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        trustedDapps: [],
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getInitialSnapState = () => cloneDeep(initialSnapState);
