import { MetaMaskInpageProvider } from '@metamask/providers';
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
  PkhDIDProvider,
  getDidPkhResolver as pkhDidResolver,
} from '@veramo/did-provider-pkh';
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
  '0x5': 'goerli',
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

export const getAgent = async (
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider
): Promise<Agent> => {
  const state = await getSnapState(snap);
  const CHAIN_ID = await getCurrentNetwork(ethereum);
  const account = await getCurrentAccount(ethereum);

  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};
  const enabledVCStores = getEnabledVCStores(account as string, state);
  console.log('Enabled VC Stores:', enabledVCStores);

  const networks = [
    {
      name: 'mainnet',
      provider: new Web3Provider(ethereum as any),
    },
    {
      name: '0x05',
      provider: new Web3Provider(ethereum as any),
    },
    {
      name: 'goerli',
      provider: new Web3Provider(ethereum as any),
      chainId: '0x5',
    },
  ];

  web3Providers['metamask'] = new Web3Provider(ethereum as any);
  didProviders['did:ethr'] = new EthrDIDProvider({
    defaultKms: 'web3',
    networks,
  });

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });
  didProviders['did:pkh'] = new PkhDIDProvider({ defaultKms: 'web3' });

  vcStorePlugins['snap'] = new SnapVCStore(snap, ethereum);
  if (enabledVCStores.includes('ceramic')) {
    vcStorePlugins['ceramic'] = new CeramicVCStore(snap, ethereum);
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
          snap: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DataManager({ store: vcStorePlugins }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
          ...keyDidResolver(),
          ...pkhDidResolver(),
        }),
      }),
      new DIDManager({
        store: new SnapDIDStore(snap, ethereum),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
    ],
  });
  return agent;
};
