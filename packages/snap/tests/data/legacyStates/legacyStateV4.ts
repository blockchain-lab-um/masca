import type {
  MascaLegacyAccountStateV4,
  MascaLegacyStateV4,
  MascaLegacyAccountConfigV4,
  PolygonLegacyBaseStateV4,
  PolygonLegacyStateV4,
  DappLegacyPermissionsV4,
} from '@blockchain-lab-um/masca-types';
import cloneDeep from 'lodash.clonedeep';

const emptyPolygonBaseState: PolygonLegacyBaseStateV4 = {
  credentials: {},
  identities: {},
  profiles: {},
  merkleTreeMeta: [],
  merkleTree: {},
};

const emptyPolygonState: PolygonLegacyStateV4 = {
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
    } as MascaLegacyAccountConfigV4,
  },
} as MascaLegacyAccountStateV4;

export const getLegacyEmptyAccountStateV4 = () => cloneDeep(emptyAccountState);

const initialLegacyPermissionsV4: DappLegacyPermissionsV4 = {
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

export const getInitialLegacyPermissionsV4 = () =>
  cloneDeep(initialLegacyPermissionsV4);

const initialSnapState: MascaLegacyStateV4 = {
  v4: {
    accountState: {},
    currentAccount: '',
    config: {
      dApp: {
        disablePopups: false,
        permissions: {
          'masca.io': getInitialLegacyPermissionsV4(),
        },
      },
      snap: {
        acceptedTerms: true,
      },
    },
  },
};

export const getLegacyStateV4 = () => cloneDeep(initialSnapState);
