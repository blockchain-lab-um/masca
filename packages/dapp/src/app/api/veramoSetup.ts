import { getDidKeyResolver as didKeyResolver } from '@blockchain-lab-um/did-provider-key';
import {
  createAgent,
  IIdentifier,
  type ICredentialVerifier,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialPlugin,
  type ICredentialIssuer,
} from '@veramo/credential-w3c';
import { AbstractDIDStore, DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import {
  getDidPkhResolver as didPkhResolver,
  PkhDIDProvider,
} from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import {
  ProviderConfiguration,
  getResolver as didEnsResolver,
} from 'ens-did-resolver';
import { JsonRpcProvider } from 'ethers';
import { getResolver as didEthrResolver } from 'ethr-did-resolver';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IResolver &
    ICredentialVerifier &
    ICredentialIssuer
>;

const networks = [
  {
    name: 'mainnet',
    provider: new JsonRpcProvider(
      process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/'
    ),
  },
  {
    name: 'sepolia',
    provider: new JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/'
    ),
    chainId: '0xaa36a7',
  },
];

export const getAgent = async (): Promise<Agent> => {
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new DIDManager({
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        store: new MemoryDIDStore(),
        defaultProvider: 'did:pkh',
        providers: {
          'did:ethr': new EthrDIDProvider({
            defaultKms: 'local',
            networks,
          }),
          'did:pkh': new PkhDIDProvider({
            defaultKms: 'local',
            chainId: '0x01',
          }),
        },
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...didEthrResolver({ networks }),
          ...didPkhResolver(),
          ...didKeyResolver(),
          ...didEnsResolver({
            networks: networks as unknown as ProviderConfiguration[],
          }),
        }),
      }),
    ],
  });

  return agent;
};

class MemoryDIDStore extends AbstractDIDStore {
  #store = new Map<string, IIdentifier>();

  async importDID(did: IIdentifier): Promise<boolean> {
    this.#store.set(did.did, did);
    return true;
  }

  async getDID(args: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    const did = this.#store.get(args.did);
    if (!did) throw Error('DID not found');
    return did;
  }

  async deleteDID(args: { did: string }): Promise<boolean> {
    const did = this.#store.delete(args.did);
    if (!did) throw Error('DID not found');
    return true;
  }

  async listDIDs(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    return Array.from(this.#store.values());
  }
}
