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
  VCManager,
  IVCManager,
  AbstractVCStore,
} from '@blockchain-lab-um/veramo-vc-manager';
import { Web3Provider } from '@ethersproject/providers';
import { Web3KeyManagementSystem } from '@veramo/kms-web3';
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from '@veramo/credential-eip712';
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

import { getCurrentNetwork } from '../utils/snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { getSnapState } from '../utils/stateUtils';

export const getAgent = async (
  wallet: SnapProvider
): Promise<
  TAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      IVCManager &
      ICredentialIssuerEIP712 &
      ICredentialIssuer
  >
> => {
  const state = await getSnapState(wallet);

  const INFURA_PROJECT_ID = state.snapConfig.snap.infuraToken;
  const CHAIN_ID = await getCurrentNetwork(wallet);
  console.log('INFURA_PROJECT_ID', INFURA_PROJECT_ID, 'CHAIN ID', CHAIN_ID);

  const web3Providers: Record<string, Web3Provider> = {};
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractVCStore> = {};

  web3Providers['metamask'] = new Web3Provider(wallet as any);

  didProviders['did:ethr'] = new EthrDIDProvider({
    defaultKms: 'web3',
    network: availableNetworks[CHAIN_ID] ?? 'mainnet',
    rpcUrl:
      `https://${availableNetworks[CHAIN_ID] ?? 'mainnet'}.infura.io/v3/` +
      INFURA_PROJECT_ID,
    web3Provider: new Web3Provider(wallet as any),
  });

  didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });

  vcStorePlugins['snap'] = new SnapVCStore(wallet);
  vcStorePlugins['ceramic'] = new CeramicVCStore(wallet);
  console.log('Started building agent...');
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      IVCManager &
      ICredentialIssuerEIP712 &
      ICredentialIssuer
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          web3: new Web3KeyManagementSystem(web3Providers),
          snap: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new VCManager({ store: vcStorePlugins }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
          ...keyDidResolver(),
        }),
      }),
      new DIDManager({
        store: new SnapDIDStore(wallet),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
    ],
  });
  console.log('Agent built..');
  return agent;
};
