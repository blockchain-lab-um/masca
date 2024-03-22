import type {
  MascaLegacyAccountStateV1,
  MascaLegacyStateV1,
  MascaLegacyAccountConfigV1,
  PolygonLegacyBaseStateV1,
  PolygonLegacyStateV1,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyPolygonBaseState: PolygonLegacyBaseStateV1 = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonLegacyStateV1 = {
  polygonid: {
    eth: {
      main: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      goerli: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
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
      goerli: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
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
    } as MascaLegacyAccountConfigV1,
  },
} as MascaLegacyAccountStateV1;

export const getLegacyEmptyAccountStateV1 = () => cloneDeep(emptyAccountState);

const initialSnapState: MascaLegacyStateV1 = {
  v1: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        friendlyDapps: ['masca.io'],
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getLegacyStateV1 = () => cloneDeep(initialSnapState);
