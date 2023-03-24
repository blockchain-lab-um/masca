/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/dot-notation */

import {
  AbstractDataStore,
  DataManager,
  IDataManager,
} from '@blockchain-lab-um/veramo-vc-manager';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  IDIDManager,
  IDataStore,
  IKeyManager,
  IResolver,
  TAgent,
  createAgent,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
} from '@veramo/credential-ld';
import { CredentialPlugin, ICredentialIssuer } from '@veramo/credential-w3c';
import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import {
  PkhDIDProvider,
  getDidPkhResolver as pkhDidResolver,
} from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

// import { EbsiDIDProvider } from '../did/ebsi/ebsiDidProvider';
// import { ebsiDidResolver } from '../did/ebsi/ebsiDidResolver';
import { KeyDIDProvider } from '../did/key/keyDidProvider';
import { getDidKeyResolver as keyDidResolver } from '../did/key/keyDidResolver';
import { getCurrentAccount, getEnabledVCStores } from '../utils/snapUtils';
import { getSnapState } from '../utils/stateUtils';
import { CeramicVCStore } from './plugins/ceramicDataStore/ceramicDataStore';
import {
  SnapDIDStore,
  SnapVCStore,
} from './plugins/snapDataStore/snapDataStore';

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
  const account = await getCurrentAccount(state);

  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};
  const enabledVCStores = getEnabledVCStores(account, state);

  const networks = [
    {
      name: 'mainnet',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: new ethers.providers.Web3Provider(ethereum as any),
    },
    {
      name: '0x05',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: new ethers.providers.Web3Provider(ethereum as any),
    },
    {
      name: 'goerli',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: new ethers.providers.Web3Provider(ethereum as any),
      chainId: '0x5',
    },
  ];

  didProviders['did:ethr'] = new EthrDIDProvider({
    defaultKms: 'web3',
    networks,
  });

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });
  didProviders['did:pkh'] = new PkhDIDProvider({ defaultKms: 'web3' });
  // didProviders['did:ebsi'] = new EbsiDIDProvider({ defaultKms: 'web3' });

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
          // ...ebsiDidResolver(),
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
