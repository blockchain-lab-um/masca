import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  ICredentialIssuer,
  ICredentialVerifier,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
  createAgent,
} from '@veramo/core';
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from '@veramo/credential-eip712';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  AbstractIdentifierProvider,
  DIDManager,
  MemoryDIDStore,
} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { getDidJwkResolver as jwkDidResolver } from '@veramo/did-provider-jwk';
import { getDidPkhResolver as pkhDidResolver } from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as ensDidResolver } from 'ens-did-resolver';
import { JsonRpcProvider } from 'ethers';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

export type Agent = TAgent<
  IResolver &
    ICredentialVerifier &
    ICredentialIssuer &
    IDIDManager &
    IKeyManager &
    ICredentialIssuerEIP712
>;

export const createVeramoAgent = async () => {
  const networks: any = [
    {
      name: '',
      provider: new JsonRpcProvider('https://eth.llamarpc.com'),
    },
    {
      name: 'mainnet',
      provider: new JsonRpcProvider('https://eth.llamarpc.com'),
    },
    {
      name: 'sepolia',
      provider: new JsonRpcProvider('https://sepolia.gateway.tenderly.co'),
      registry: '0x03d5003bf0e79c5f5223588f347eba39afbc3818',
    },
  ];
  const didProviders: Record<string, AbstractIdentifierProvider> = {
    'did:ethr': new EthrDIDProvider({
      defaultKms: 'local',
      networks,
    }),
    'did:key': new KeyDIDProvider({ defaultKms: 'local' }),
  };

  return createAgent<Agent>({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
          ...keyDidResolver(),
          ...pkhDidResolver(),
          ...jwkDidResolver(),
          ...ensDidResolver({
            networks,
          }),
        }),
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:key',
        providers: didProviders,
      }),
    ],
  });
};
