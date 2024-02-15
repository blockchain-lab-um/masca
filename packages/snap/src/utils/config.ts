import type {
  DappPermissions,
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
      mumbai: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
    },
  },
  iden3: {
    eth: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState), // To satisfy the type checker
    },
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
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
    } as MascaAccountConfig,
  },
} as MascaAccountState;

export const getEmptyAccountState = () => cloneDeep(emptyAccountState);

const initialPermissions: DappPermissions = {
  trustedDapp: false,
  queryCredentials: false,
  saveCredential: false,
  createPresentation: false,
  deleteCredential: false,
  togglePopups: false,
  addTrustedDapp: false,
  removeTrustedDapp: false,
  getDID: false,
  getSelectedMethod: false,
  getAvailableMethods: false,
  switchDIDMethod: false,
  getCredentialStore: false,
  setCredentialStore: false,
  getAvailableCredentialStores: false,
  getAccountSettings: false,
  getSnapSettings: false,
  getWalletId: false,
  resolveDID: false,
  createCredential: false,
  setCurrentAccount: false,
  verifyData: false,
  handleCredentialOffer: false,
  handleAuthorizationRequest: false,
  setCeramicSession: false,
  validateStoredCeramicSession: false,
  exportStateBackup: false,
  importStateBackup: false,
  signData: false,
  changePermission: false,
};

export const getInitialPermissions = () => cloneDeep(initialPermissions);

const initialSnapState: MascaState = {
  v1: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        permissions: {
          'masca.io': getInitialPermissions(),
        },
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getInitialSnapState = () => cloneDeep(initialSnapState);
