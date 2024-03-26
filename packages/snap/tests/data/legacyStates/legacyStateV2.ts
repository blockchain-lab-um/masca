import type {
  MascaLegacyAccountStateV2,
  MascaLegacyStateV2,
  MascaLegacyAccountConfigV2,
  PolygonLegacyBaseStateV2,
  PolygonLegacyStateV2,
  DappLegacyPermissionsV2,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyPolygonBaseState: PolygonLegacyBaseStateV2 = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonLegacyStateV2 = {
  polygonid: {
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
    },
    eth: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
    },
  },
  iden3: {
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
    },
    eth: {
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
    } as MascaLegacyAccountConfigV2,
  },
} as MascaLegacyAccountStateV2;

export const getLegacyEmptyAccountStateV2 = () => cloneDeep(emptyAccountState);

const initialLegacyPermissionsV2: DappLegacyPermissionsV2 = {
  trusted: false,
  methods: {
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
    addDappSettings: false,
    removeDappSettings: false,
  },
};

export const getInitialLegacyPermissionsV2 = () =>
  cloneDeep(initialLegacyPermissionsV2);

const initialSnapState: MascaLegacyStateV2 = {
  v2: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        permissions: {
          'masca.io': getInitialLegacyPermissionsV2(),
        },
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getLegacyStateV2 = () => cloneDeep(initialSnapState);
