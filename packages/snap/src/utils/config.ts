import {
  CURRENT_STATE_VERSION,
  type DappPermissions,
  type MascaAccountConfig,
  type MascaAccountState,
  type MascaState,
  type PolygonBaseState,
  type PolygonState,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

export const UNIRESOLVER_PROXY_URL = 'https://masca.io/api/proxy/uniresolver';

export const emptyPolygonBaseState: PolygonBaseState = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonState = {
  polygonid: {
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      amoy: cloneDeep(emptyPolygonBaseState),
    },
  },
  iden3: {
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      amoy: cloneDeep(emptyPolygonBaseState),
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

// order/priority: forced, global, trusted dapp, specific rpc method
const initialPermissions: DappPermissions = {
  trusted: false,
  methods: {
    queryCredentials: false,
    saveCredential: false,
    createPresentation: false,
    decodeSdJwtPresentation: false,
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
    addDappSettings: false,
    removeDappSettings: false,
  },
};

export const getInitialPermissions = () => cloneDeep(initialPermissions);

const initialSnapState: MascaState = {
  [CURRENT_STATE_VERSION]: {
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
