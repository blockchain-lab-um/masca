import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  AvailableVCStores,
  CreateVPRequestParams,
  Filter,
  MinimalUnsignedCredential,
  QueryVCsOptions,
  QueryVCsRequestResult,
  SaveVCRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import {
  IOIDCClientPlugin,
  OIDCClientPlugin,
  SignArgs,
} from '@blockchain-lab-um/oidc-client-plugin';
import {
  CredentialRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import {
  AbstractDataStore,
  DataManager,
  IDataManager,
} from '@blockchain-lab-um/veramo-datamanager';
import { Web3Provider } from '@ethersproject/providers';
import { heading, panel } from '@metamask/snaps-ui';
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
  UnsignedCredential,
  UnsignedPresentation,
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
import { decodeCredentialToObject } from '@veramo/utils';
import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import EthereumService from 'src/Ethereum.service';
import {
  handleAuthorizationRequest,
  sendAuthorizationResponse,
} from 'src/utils/oidc';

import UniversalResolverService from '../UniversalResolver.service';
import { getAddressKeyDeriver, snapGetKeysFromAddress } from '../utils/keyPair';
import { sign } from '../utils/sign';
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
    const didProviders: Record<string, AbstractIdentifierProvider> = {};
    const vcStorePlugins: Record<string, AbstractDataStore> = {};
    const enabledVCStores = Object.entries(
      state.accountState[state.currentAccount].accountConfig.ssi.vcStore
    )
      .filter(([, value]) => value)
      .map(([key]) => key) as AvailableVCStores[];

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
            ...UniversalResolverService.getResolver(),
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
    const account = state.currentAccount;
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
    const account = state.currentAccount;
    const method = state.accountState[account].accountConfig.ssi.didMethod;

    switch (method) {
      case 'did:pkh':
      case 'did:ethr': {
        const chainId = await EthereumService.getNetwork();

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

  static async createCredential(
    args: ICreateVerifiableCredentialArgs
  ): Promise<VerifiableCredential> {
    return this.instance.createVerifiableCredential(args);
  }

  static async createUnsignedCredential(args: {
    credential: MinimalUnsignedCredential;
  }): Promise<UnsignedCredential> {
    const { credential } = args;
    const { did } = await this.getIdentifier();

    if (!credential.credentialSubject) {
      throw new Error('Verifiable credential must have a credentialSubject');
    }
    if (
      credential.type &&
      typeof credential.type === 'string' &&
      credential.type !== 'VerifiableCredential'
    ) {
      throw new Error('Invalid type');
    }

    if (
      (credential.issuer &&
        typeof credential.issuer === 'string' &&
        credential.issuer !== did) ||
      (credential.issuer?.id &&
        credential.issuer.id &&
        credential.issuer.id !== did)
    ) {
      throw new Error('Invalid issuer');
    }

    if (
      credential.type &&
      Array.isArray(credential.type) &&
      !credential.type.includes('VerifiableCredential')
    ) {
      credential.type.unshift('VerifiableCredential');
    }

    if (!credential.type) {
      credential.type = ['VerifiableCredential'];
    }

    const unsignedCredential: UnsignedCredential = {
      ...credential,
      type: credential.type,
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuer: credential.issuer ? credential.issuer : did,
      issuanceDate: credential.issuanceDate
        ? credential.issuanceDate
        : new Date().toISOString(),
    };

    return unsignedCredential;
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

  static async createUnsignedPresentation(args: {
    credentials: W3CVerifiableCredential[];
  }): Promise<UnsignedPresentation> {
    const { credentials } = args;

    const { did } = await this.getIdentifier();

    // FIXME: there's an issue here
    const canonicalizedVcs = credentials.map((credential) => {
      // code from
      // https://github.com/uport-project/veramo/blob/2ce705680173174e7399c4d0607b67b7303c6c97/packages/credential-eip712/src/agent/CredentialEIP712.ts#L215
      if (typeof credential === 'string') {
        return credential;
      }
      if (credential.proof.jwt) {
        return credential.proof.jwt as string;
      }

      return JSON.stringify(credential);
    });

    const unsignedVp: UnsignedPresentation = {
      holder: did,
      verifiableCredential: canonicalizedVcs,
      type: ['VerifiablePresentation', 'Custom'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: new Date().toISOString(),
    };

    return unsignedVp;
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

  static async handleOIDCCredentialOffer(args: {
    credentialOfferURI: string;
  }): Promise<VerifiableCredential> {
    const state = await getSnapState();
    const bip44CoinTypeNode = await getAddressKeyDeriver({
      state,
      snap,
      account: state.currentAccount,
    });

    if (!bip44CoinTypeNode) {
      throw new Error('bip44CoinTypeNode is required');
    }

    const identifier = await VeramoService.getIdentifier();
    const { did } = identifier;

    if (did.startsWith('did:ethr') || did.startsWith('did:pkh')) {
      throw new Error('did:ethr and did:pkh are not supported');
    }

    const agent = VeramoService.getAgent();

    const credentialOfferResult = await agent.parseOIDCCredentialOfferURI({
      credentialOfferURI: args.credentialOfferURI,
    });

    if (isError(credentialOfferResult)) {
      throw new Error(credentialOfferResult.error);
    }

    const { credentials, grants } = credentialOfferResult.data;

    const res = await snapGetKeysFromAddress({
      snap,
      bip44CoinTypeNode,
      account: state.currentAccount,
      state,
    });

    if (res === null) throw new Error('Could not get keys from address');

    // TODO: Is this fine or should we improve it ?
    const kid = `${identifier.did}#${identifier.did.split(':')[2]}`;

    const isDidKeyEbsi =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod ===
      'did:key:jwk_jcs-pub';

    const customSign = async (signArgs: SignArgs) =>
      sign(signArgs, {
        privateKey: res.privateKey,
        curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
        did: identifier.did,
        kid,
      });

    let tokenRequestResult: Result<TokenResponse>;

    if (grants?.authorization_code) {
      const authorizationRequestURIResult = await agent.getAuthorizationRequest(
        {
          clientId: identifier.did,
        }
      );

      if (isError(authorizationRequestURIResult)) {
        throw new Error(authorizationRequestURIResult.error);
      }

      const authorizationRequestURI = authorizationRequestURIResult.data;

      console.log(`authorizationRequestURI: ${authorizationRequestURI}`);

      const handleAuthorizationRequestResult = await handleAuthorizationRequest(
        {
          authorizationRequestURI,
          did,
          customSign,
        }
      );

      if (handleAuthorizationRequestResult.isUserInteractionRequired) {
        throw new Error(
          'User interaction is required. This is not supported yet'
        );
      }

      const { sendOIDCAuthorizationResponseArgs } =
        handleAuthorizationRequestResult;

      const sendAuthorizationResponseResult = await sendAuthorizationResponse({
        sendOIDCAuthorizationResponseArgs,
      });

      const { code } = sendAuthorizationResponseResult;

      tokenRequestResult = await agent.sendTokenRequest({
        code,
        clientId: did,
      });
    } else if (
      grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']
    ) {
      // Check if PIN is required
      const isPinRequired =
        grants['urn:ietf:params:oauth:grant-type:pre-authorized_code']
          .user_pin_required ?? false;

      let pin;

      // Ask user for PIN
      if (isPinRequired) {
        pin = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'prompt',
            content: panel([
              heading('Please enter the PIN you received from the issuer'),
            ]),
            placeholder: 'PIN...',
          },
        });

        if (!pin || typeof pin !== 'string') {
          throw new Error('PIN is required');
        }
      }
      tokenRequestResult = await agent.sendTokenRequest(pin ? { pin } : {});
    } else {
      throw new Error('Unsupported grant type');
    }

    if (isError(tokenRequestResult)) {
      throw new Error(tokenRequestResult.error);
    }

    console.log('here');

    // TODO: Handle multiple credentials
    let selectedCredential = credentials[0];

    if (typeof selectedCredential === 'string') {
      const getCredentialResult = await agent.getCredentialInfoById({
        id: selectedCredential,
      });

      if (isError(getCredentialResult)) {
        throw new Error(getCredentialResult.error);
      }

      selectedCredential = getCredentialResult.data;
    }

    const credentialRequest: CredentialRequest =
      selectedCredential.format === 'mso_mdoc'
        ? {
            format: 'mso_mdoc',
            doctype: selectedCredential.doctype,
          }
        : {
            format: selectedCredential.format,
            types: selectedCredential.types,
          };

    // Create proof of possession
    const proofOfPossessionResult = await agent.proofOfPossession({
      sign: customSign,
    });

    if (isError(proofOfPossessionResult)) {
      throw new Error(proofOfPossessionResult.error);
    }

    credentialRequest.proof = proofOfPossessionResult.data;

    const credentialRequestResult = await agent.sendCredentialRequest(
      credentialRequest
    );

    if (isError(credentialRequestResult)) {
      throw new Error(credentialRequestResult.error);
    }

    const credentialResponse = credentialRequestResult.data;

    console.log(credentialResponse);

    if (!credentialResponse.credential) {
      throw new Error('An error occurred while requesting the credential');
    }

    const credential = decodeCredentialToObject(credentialResponse.credential);

    return credential;
  }

  // TODO: We can probably have different return types
  static async handleOIDCAuthorizationRequest(args: {
    authorizationRequestURI: string;
  }): Promise<VerifiableCredential[]> {
    const { authorizationRequestURI } = args;

    const state = await getSnapState();
    const bip44CoinTypeNode = await getAddressKeyDeriver({
      state,
      snap,
      account: state.currentAccount,
    });

    if (!bip44CoinTypeNode) {
      throw new Error('bip44CoinTypeNode is required');
    }

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (did.startsWith('did:ethr') || did.startsWith('did:pkh')) {
      throw new Error('did:ethr and did:pkh are not supported');
    }
    const res = await snapGetKeysFromAddress({
      snap,
      bip44CoinTypeNode,
      account: state.currentAccount,
      state,
    });

    if (res === null) throw new Error('Could not get keys from address');

    // TODO: Is this fine or should we improve it ?
    const kid = `${did}#${did.split(':')[2]}`;

    const isDidKeyEbsi =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod ===
      'did:key:jwk_jcs-pub';

    const customSign = async (signArgs: SignArgs) =>
      sign(signArgs, {
        privateKey: res.privateKey,
        curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
        did,
        kid,
      });

    const handleAuthorizationRequestResult = await handleAuthorizationRequest({
      authorizationRequestURI,
      customSign,
      did,
    });

    if (handleAuthorizationRequestResult.isUserInteractionRequired) {
      throw new Error(
        'User interaction is required. This is not supported yet'
      );
    }

    const { sendOIDCAuthorizationResponseArgs } =
      handleAuthorizationRequestResult;

    const sendAuthorizationResponseResult = await sendAuthorizationResponse({
      sendOIDCAuthorizationResponseArgs,
    });

    console.log(sendAuthorizationResponseResult);

    throw new Error('Not implemented');
  }

  static getAgent(): Agent {
    return this.instance;
  }
}

export default VeramoService;
