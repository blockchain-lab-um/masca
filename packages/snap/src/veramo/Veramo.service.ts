import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  AvailableVCStores,
  CreateVPRequestParams,
  Filter,
  QueryVCsOptions,
  QueryVCsRequestResult,
  SaveVCRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import {
  IOIDCClientPlugin,
  OIDCClientPlugin,
} from '@blockchain-lab-um/oidc-client-plugin';
import {
  AbstractDataStore,
  DataManager,
  IDataManager,
} from '@blockchain-lab-um/veramo-datamanager';
import { Web3Provider } from '@ethersproject/providers';
import {
  createAgent,
  CredentialStatus,
  ICreateVerifiableCredentialArgs,
  ICredentialIssuer,
  ICredentialVerifier,
  IDataStore,
  IDIDManager,
  IIdentifier,
  IKeyManager,
  IResolver,
  IVerifyResult,
  TAgent,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { CredentialStatusPlugin } from '@veramo/credential-status';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  AbstractIdentifierProvider,
  DIDManager,
  MemoryDIDStore,
} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import {
  JwkDIDProvider,
  getDidJwkResolver as jwkDidResolver,
} from '@veramo/did-provider-jwk';
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
import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

import { getUniversalDidResolver as universalDidResolver } from '../did/universal/universalDidResolver';
import { getAddressKeyDeriver, snapGetKeysFromAddress } from '../utils/keyPair';
import {
  getCurrentAccount,
  getCurrentNetwork,
  getEnabledVCStores,
} from '../utils/snapUtils';
import { getSnapState } from '../utils/stateUtils';
import { CeramicVCStore } from './plugins/ceramicDataStore/ceramicDataStore';
import { SnapVCStore } from './plugins/snapDataStore/snapDataStore';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IDataManager &
    ICredentialIssuer &
    ICredentialVerifier &
    IOIDCClientPlugin
>;

class VeramoService {
  private static instance: Agent;

  static async init(): Promise<void> {
    const state = await getSnapState();
    const account = getCurrentAccount(state);

    const didProviders: Record<string, AbstractIdentifierProvider> = {};
    const vcStorePlugins: Record<string, AbstractDataStore> = {};
    const enabledVCStores = getEnabledVCStores(account, state);

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
      {
        name: 'sepolia',
        provider: new Web3Provider(ethereum as any),
        chainId: '0xaa36a7',
      },
    ];

    didProviders['did:ethr'] = new EthrDIDProvider({
      defaultKms: 'web3',
      networks,
    });

    didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });
    didProviders['did:pkh'] = new PkhDIDProvider({ defaultKms: 'web3' });
    didProviders['did:jwk'] = new JwkDIDProvider({ defaultKms: 'web3' });

    vcStorePlugins.snap = new SnapVCStore(snap, ethereum);
    if (enabledVCStores.includes('ceramic')) {
      vcStorePlugins.ceramic = new CeramicVCStore(snap, ethereum);
    }

    this.instance = createAgent<
      IDIDManager &
        IKeyManager &
        IDataStore &
        IResolver &
        IDataManager &
        ICredentialIssuer &
        ICredentialVerifier &
        IOIDCClientPlugin
    >({
      plugins: [
        new CredentialPlugin(),
        new CredentialIssuerEIP712(),
        new CredentialStatusPlugin({
          // TODO implement this
          StatusList2021Entry: (
            _credential: any,
            _didDoc: any
          ): Promise<CredentialStatus> => Promise.resolve({ revoked: false }),
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
            ...jwkDidResolver(),
            ...universalDidResolver(),
          }),
        }),
        new DIDManager({
          store: new MemoryDIDStore(),
          defaultProvider: 'metamask',
          providers: didProviders,
        }),
        new OIDCClientPlugin(),
      ],
    });

    // Import current account as did
    await this.importIdentifier();
  }

  private static async importIdentifier(): Promise<void> {
    const state = await getSnapState();
    const account = getCurrentAccount(state);
    const method = state.accountState[account].accountConfig.ssi.didMethod;
    const bip44CoinTypeNode = await getAddressKeyDeriver({
      state,
      snap,
      account,
    });

    switch (method) {
      case 'did:pkh':
      case 'did:ethr': {
        return;
      }
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        const res = await snapGetKeysFromAddress({
          bip44CoinTypeNode,
          account,
          snap,
          state,
        });

        if (!res) throw new Error('Failed to get keys');

        const identifier: IIdentifier = await this.instance.didManagerCreate({
          alias: `metamask-${method}-${account}`,
          provider: method === 'did:key:jwk_jcs-pub' ? 'did:key' : method,
          kms: 'snap',
          options: {
            privateKeyHex: res.privateKey.slice(2),
            keyType:
              method === 'did:key:jwk_jcs-pub' ? 'Secp256r1' : 'Secp256k1',
            ...(method === 'did:key:jwk_jcs-pub' && { type: 'ebsi' }),
          },
        });

        if (!identifier?.did) throw new Error('Failed to create identifier');
        return;
      }
      default:
        throw new Error('Unsupported DID method');
    }
  }

  static async getIdentifier(): Promise<IIdentifier> {
    const state = await getSnapState();
    const account = getCurrentAccount(state);
    const method = state.accountState[account].accountConfig.ssi.didMethod;

    switch (method) {
      case 'did:pkh':
      case 'did:ethr': {
        const chainId = await getCurrentNetwork(ethereum);

        if (method === 'did:pkh' && chainId !== '0x1' && chainId !== '0x89') {
          throw new Error(
            `Unsupported network with chainid ${chainId} for ${method}`
          );
        }

        const identifier: IIdentifier = {
          provider: method,
          did:
            method === 'did:ethr'
              ? `did:ethr:${chainId}:${state.currentAccount}`
              : `did:pkh:eip155:${chainId}:${state.currentAccount}`,
          keys: [],
          services: [],
        };

        return identifier;
      }
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        return this.instance.didManagerGetByAlias({
          alias: `metamask-${method}-${account}`,
          provider: method === 'did:key:jwk_jcs-pub' ? 'did:key' : method,
        });
      }
      default:
        throw new Error('Unsupported DID method');
    }
  }

  static async resolveDID(did: string): Promise<DIDResolutionResult> {
    return this.instance.resolveDid({ didUrl: did });
  }

  static async saveCredential(args: {
    verifiableCredential: W3CVerifiableCredential;
    store: AvailableVCStores | AvailableVCStores[];
  }): Promise<SaveVCRequestResult[]> {
    const { verifiableCredential, store } = args;
    const result = await this.instance.save({
      data: verifiableCredential,
      options: { store },
    });

    const vcs = new Map<string, SaveVCRequestResult>();

    for (const vc of result) {
      if (!vc.store) {
        throw new Error('Missing store in VC metadata');
      }

      const existingVC = vcs.get(vc.id);
      if (existingVC) {
        existingVC.store.push(vc.store);
      } else {
        vcs.set(vc.id, {
          id: vc.id,
          store: [vc.store],
        });
      }
    }
    return [...vcs.values()];
  }

  static async deleteCredential(args: {
    id: string;
    store?: AvailableVCStores | AvailableVCStores[];
  }): Promise<boolean[]> {
    const { id, store } = args;

    const result = await this.instance.delete({
      id,
      ...(store ? { options: { store } } : {}),
    });

    return result;
  }

  static async queryCredentials(args: {
    options: QueryVCsOptions;
    filter?: Filter;
  }): Promise<QueryVCsRequestResult[]> {
    const { options, filter } = args;
    const result = await this.instance.query({
      filter,
      options,
    });

    const vcs = new Map<string, QueryVCsRequestResult>();

    for (const vc of result) {
      if (options.returnStore && !vc.metadata.store) {
        throw new Error('Missing store in VC metadata');
      }

      const existingVC = vcs.get(vc.metadata.id);
      if (existingVC) {
        if (options.returnStore) {
          existingVC.metadata.store?.push(vc.metadata.store as string);
        }
      } else {
        vcs.set(vc.metadata.id, {
          data: vc.data as VerifiableCredential,
          metadata: {
            id: vc.metadata.id,
            ...(options.returnStore && {
              store: [vc.metadata.store as string],
            }),
          },
        });
      }
    }
    return [...vcs.values()];
  }

  static async createPresentation(
    args: CreateVPRequestParams
  ): Promise<VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = args;
    const domain = proofOptions?.domain;
    const challenge = proofOptions?.challenge;
    const identifier = await this.getIdentifier();

    return this.instance.createVerifiablePresentation({
      presentation: {
        holder: identifier.did,
        type: ['VerifiablePresentation', 'Custom'],
        verifiableCredential: vcs,
      },
      proofFormat,
      domain,
      challenge,
    });
  }

  static async clearCredentials(args: {
    store?: AvailableVCStores | AvailableVCStores[];
    filter?: Filter;
  }): Promise<boolean[]> {
    const { store, filter } = args;

    const result = await this.instance.clear({
      filter,
      ...(store ? { options: { store } } : {}),
    });

    return result;
  }

  static async verifyData(
    args: VerifyDataRequestParams
  ): Promise<IVerifyResult> {
    try {
      const { credential, presentation } = args;

      if (credential) {
        const vcResult = await this.instance.verifyCredential({
          credential,
        });
        return JSON.parse(JSON.stringify(vcResult)) as IVerifyResult;
      }
      if (presentation) {
        const vpResult = await this.instance.verifyPresentation({
          presentation,
        });
        return JSON.parse(JSON.stringify(vpResult)) as IVerifyResult;
      }
      return {
        verified: false,
        error: new Error('No valid credential or presentation.'),
      } as IVerifyResult;
    } catch (error: unknown) {
      return { verified: false, error: error as Error } as IVerifyResult;
    }
  }

  static async createCredential(
    args: ICreateVerifiableCredentialArgs
  ): Promise<VerifiableCredential> {
    return this.instance.createVerifiableCredential(args);
  }

  static getAgent(): Agent {
    return this.instance;
  }
}

export default VeramoService;
