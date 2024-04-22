import type {
  MascaLegacyAccountStateV3,
  MascaLegacyStateV3,
  MascaLegacyAccountConfigV3,
  PolygonLegacyBaseStateV3,
  PolygonLegacyStateV3,
  DappLegacyPermissionsV3,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyPolygonBaseState: PolygonLegacyBaseStateV3 = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonLegacyStateV3 = {
  polygonid: {
    polygon: {
      main: cloneDeep(emptyPolygonBaseState),
      mumbai: cloneDeep(emptyPolygonBaseState),
    },
  },
  iden3: {
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
    } as MascaLegacyAccountConfigV3,
  },
} as MascaLegacyAccountStateV3;

export const getLegacyEmptyAccountStateV3 = () => cloneDeep(emptyAccountState);

const initialLegacyPermissionsV3: DappLegacyPermissionsV3 = {
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

export const getInitialLegacyPermissionsV3 = () =>
  cloneDeep(initialLegacyPermissionsV3);

const initialSnapState: MascaLegacyStateV3 = {
  v3: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        permissions: {
          'masca.io': getInitialLegacyPermissionsV3(),
        },
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getLegacyStateV3 = () => cloneDeep(initialSnapState);
