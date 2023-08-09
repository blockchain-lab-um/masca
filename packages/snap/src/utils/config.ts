import type {
  MascaAccountConfig,
  MascaAccountState,
  MascaState,
  MascaStateWrapper,
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
  polygon: {
    state: emptyPolygonState
  },
  veramo: {
    credentials: {}
  },
  general: {
    account: {
      ssi: {
        didMethod: 'did:ethr',
        vcStore: {
          snap: true,
          ceramic: true,
        },
      },
    } as MascaAccountConfig,
  }
} as MascaAccountState;

export const getEmptyAccountState = () => cloneDeep(emptyAccountState);

const initialSnapState: MascaStateWrapper = {
  v1: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        friendlyDapps: [],
      },
      snap: {
        acceptedTerms: true,
      },
    },
  }
};

export const getInitialSnapState = (version: `v${number}` = "v1"): MascaState => {
  switch (version) {
    case "v1":
      return cloneDeep(initialSnapState.v1);
    default:
      return cloneDeep(initialSnapState.v1)
  }
};
