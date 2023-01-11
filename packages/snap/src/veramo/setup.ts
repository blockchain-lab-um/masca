/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
  TAgent,
} from '@veramo/core';

import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import {
  DataManager,
  IDataManager,
  AbstractDataStore,
} from '@blockchain-lab-um/veramo-vc-manager';
import { Web3Provider } from '@ethersproject/providers';
//import { Web3KeyManagementSystem } from '@veramo/kms-web3';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
} from '@veramo/credential-ld';
import {
  SnapDIDStore,
  SnapVCStore,
} from './plugins/snapDataStore/snapDataStore';
import { CeramicVCStore } from './plugins/ceramicDataStore/ceramicDataStore';

import { CredentialPlugin, ICredentialIssuer } from '@veramo/credential-w3c';

import { KeyDIDProvider } from '../did/key/keyDidProvider';
import { getDidKeyResolver as keyDidResolver } from '../did/key/keyDidResolver';

const availableNetworks: Record<string, string> = {
  '0x01': 'mainnet',
  '0x05': 'goerli',
};

import {
  getCurrentAccount,
  getCurrentNetwork,
  getEnabledVCStores,
} from '../utils/snapUtils';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { getSnapState } from '../utils/stateUtils';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IDataManager &
    ICredentialIssuer
>;

export const getAgent = async (snap: SnapsGlobalObject): Promise<Agent> => {
  const state = await getSnapState(snap);
  const INFURA_PROJECT_ID = state.snapConfig.snap.infuraToken;
  const CHAIN_ID = await getCurrentNetwork(snap);
  const account = await getCurrentAccount(snap);

  const web3Providers: Record<string, Web3Provider> = {};
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};
  const enabledVCStores = getEnabledVCStores(account as string, state);
  console.log('Enabled VC Stores:', enabledVCStores);

  const networks = [
    {
      name: availableNetworks[CHAIN_ID] ?? 'mainnet',
      provider: new Web3Provider(snap as any),
    },
  ];

  web3Providers['metamask'] = new Web3Provider(snap as any);
  didProviders['did:ethr'] = new EthrDIDProvider({
    defaultKms: 'web3',
    networks,
  });

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });
  vcStorePlugins['snap'] = new SnapVCStore(snap);
  if (enabledVCStores.includes('ceramic')) {
    vcStorePlugins['ceramic'] = new CeramicVCStore(snap);
  }
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      IDataManager &
      ICredentialIssuer
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new CredentialIssuerLD({
        contextMaps: [LdDefaultContexts],
        suites: [new VeramoEcdsaSecp256k1RecoverySignature2020()],
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          //web3: new Web3KeyManagementSystem(web3Providers),
          snap: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new DataManager({ store: vcStorePlugins }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
          ...keyDidResolver(),
        }),
      }),
      new DIDManager({
        store: new SnapDIDStore(snap),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
    ],
  });
  return agent;
};
