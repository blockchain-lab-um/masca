import {
  type VerificationResult,
  VerificationService,
} from '@blockchain-lab-um/extended-verification';
import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  type AvailableCredentialStores,
  CURRENT_STATE_VERSION,
  type CreatePresentationRequestParams,
  type DecodeSdJwtPresentationRequestParams,
  type Filter,
  type MinimalUnsignedCredential,
  type QueryCredentialsOptions,
  type QueryCredentialsRequestResult,
  type SdJwtCredential,
  type SaveCredentialRequestResult,
  type VerifyDataRequestParams,
  type Disclosure,
} from '@blockchain-lab-um/masca-types';
import {
  type IOIDCClientPlugin,
  OIDCClientPlugin,
  type SendOIDCAuthorizationResponseArgs,
  type SignArgs,
} from '@blockchain-lab-um/oidc-client-plugin';
import type {
  CredentialRequest,
  PresentationDefinition,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  type Result,
  isError,
  UniversalResolverService,
} from '@blockchain-lab-um/utils';
import {
  type AbstractDataStore,
  DataManager,
  type IDataManager,
} from '@blockchain-lab-um/veramo-datamanager';
import {
  type CredentialPayload,
  type CredentialStatus,
  type ICredentialIssuer,
  type ICredentialVerifier,
  type IDIDManager,
  type IDataStore,
  type IIdentifier,
  type IKeyManager,
  type IResolver,
  type IVerifyResult,
  type ProofFormat,
  type TAgent,
  type UnsignedCredential,
  type UnsignedPresentation,
  type VerifiableCredential,
  type VerifiablePresentation,
  type W3CVerifiableCredential,
  createAgent,
} from '@veramo/core';
import type { PresentationFrame } from '@sd-jwt/types';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { CredentialStatusPlugin } from '@veramo/credential-status';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  type AbstractIdentifierProvider,
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
import { type DIDResolutionResult, Resolver } from 'did-resolver';
import {
  type ProviderConfiguration,
  getResolver as ensDidResolver,
} from 'ens-did-resolver';
import { BrowserProvider } from 'ethers';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import qs from 'qs';

import EthereumService from '../Ethereum.service';
import GeneralService from '../General.service';
import UIService from '../UI.service';
import WalletService from '../Wallet.service';
import StorageService from '../storage/Storage.service';
import { normalizeCredential } from '../utils/credential';
import { sign } from '../utils/sign';
import { CeramicCredentialStore } from './plugins/ceramicDataStore/ceramicDataStore';
import { SnapCredentialStore } from './plugins/snapDataStore/snapDataStore';

import { randomBytes } from 'node:crypto';
import SDJwtService from 'src/SDJwt.service';

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
    VeramoService.instance = await VeramoService.createAgent();
    await VerificationService.init();
  }

  /**
   * Function that creates and imports an identifier for the current account based on the selected DID method
   */
  static async importIdentifier(): Promise<void> {
    const state = StorageService.get();
    const account = state[CURRENT_STATE_VERSION].currentAccount;
    const method =
      state[CURRENT_STATE_VERSION].accountState[account].general.account.ssi
        .selectedMethod;

    switch (method) {
      case 'did:pkh':
      case 'did:ethr':
      case 'did:ens': {
        return;
      }
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        // Import into wallet
        const res = WalletService.get();

        if (!res) throw new Error('Failed to get keys');

        const identifier: IIdentifier =
          await VeramoService.instance.didManagerCreate({
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

  /**
   * Function that gets the current identifier from the agent based on the selected DID method
   */
  static async getIdentifier(): Promise<IIdentifier> {
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

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
              ? `did:ethr:${chainId}:${state[CURRENT_STATE_VERSION].currentAccount}`
              : `did:pkh:eip155:${chainId}:${state[CURRENT_STATE_VERSION].currentAccount}`,
          keys: [],
          services: [],
        };

        return identifier;
      }
      case 'did:ens': {
        const chainId = await EthereumService.getNetwork();
        if (chainId !== '0x1') {
          throw new Error(
            `Unsupported network with chainid ${chainId} for ${method}`
          );
        }
        const address = state[CURRENT_STATE_VERSION]
          .currentAccount as `0x${string}`;
        const ensName = await EthereumService.getEnsName({ address });
        const identifier: IIdentifier = {
          provider: method,
          did: `did:ens:${ensName}`,
          keys: [],
          services: [],
        };

        return identifier;
      }
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        const { alias: _, ...identifier } =
          await VeramoService.instance.didManagerGetByAlias({
            alias: `metamask-${method}-${state[CURRENT_STATE_VERSION].currentAccount}`,
            provider: method === 'did:key:jwk_jcs-pub' ? 'did:key' : method,
          });

        return identifier;
      }
      default:
        throw new Error('Unsupported DID method');
    }
  }

  /**
   * Function that returns the kid of a specific DID
   */
  static getKid(did: string): string {
    const method = did.split(':')[1];
    const kid = method === 'key' ? `${did}#${did.split(':')[2]}` : `${did}#0`;
    return kid;
  }

  /**
   * Function that resolves a DID
   * @param did - DID to resolve
   * @returns DID resolution result
   */
  static async resolveDID(did: string): Promise<DIDResolutionResult> {
    return VeramoService.instance.resolveDid({ didUrl: did });
  }

  /**
   * Function that creates a Verifiable Credential
   * @param params.credential - Minimal unsigned credential
   * @param params.proofFormat - Proof format to use
   * @returns VerifiableCredential
   */
  static async createCredential(params: {
    credential: MinimalUnsignedCredential;
    proofFormat?: ProofFormat;
  }): Promise<VerifiableCredential> {
    const state = StorageService.get();
    const { credential, proofFormat = 'jwt' } = params;
    const identifier = await VeramoService.getIdentifier();

    if (proofFormat === ('sd-jwt' as ProofFormat)) {
      return VeramoService.instance.createCredentialSdJwt({ credential });
    }

    credential.issuer = identifier.did;

    const vc = await VeramoService.instance.createVerifiableCredential({
      credential: credential as CredentialPayload,
      proofFormat,
    });

    return vc;
  }

  static async createCredentialSdJwt(params: {
    credential: MinimalUnsignedCredential;
    disclosureFrame: Record<string, any>;
  }): Promise<any> {
    const sdjwt = SDJwtService.get();
    let { credential, disclosureFrame } = params;
    const { did, keys } = await VeramoService.getIdentifier();

    const sdJwtVcPayload = {
      '@context': credential['@context'],
      id: randomBytes(16).toString('hex'),
      vct: Array.isArray(credential.type)
        ? credential.type.join(',')
        : credential.type || '',
      iss: `${did}#${keys[0].kid}`,
      iat: Math.floor(Date.now() / 1000),
      sub: `${did}#${keys[0].kid}`, // TODO: Fix this. Here is Holder reference
      credentialSubject: {
        ...credential.credentialSubject,
      },
      credentialSchema: {
        ...credential.credentialSchema,
      },
    };

    const credentialSubjectKeys: string[] = Object.keys(
      credential.credentialSubject
    );

    disclosureFrame = {
      credentialSubject: {
        _sd: credentialSubjectKeys,
      },
    };

    const sdJwtCredential = await sdjwt.issue(
      sdJwtVcPayload as any,
      disclosureFrame as any
    );

    const decode = await sdjwt.decode(sdJwtCredential);

    const signedCredentialWithDisclosures = {
      ...decode.jwt?.payload,
      signature: decode.jwt?.signature,
      encoded: sdJwtCredential,
      disclosures: decode.disclosures,
    };

    const customCredential = {
      credential: signedCredentialWithDisclosures,
      proofType: 'sd-jwt',
    };

    return customCredential;
  }

  /**
   * Function that creates an unsigned Verifiable Credential
   * @param params.credential - Minimal unsigned credential
   * @returns Unsigned VerifiableCredential
   */
  static async createUnsignedCredential(params: {
    credential: MinimalUnsignedCredential;
  }): Promise<UnsignedCredential> {
    const { credential } = params;
    const { did } = await VeramoService.getIdentifier();

    if (!credential.credentialSubject) {
      throw new Error('Verifiable credential must have a credentialSubject');
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

  /**
   * Function that saves a Verifiable Credential
   * @param params.verifiableCredential - Verifiable Credential to save
   * @param params.store - Store to save the Verifiable Credential in
   * @returns SaveVCRequestResult
   */
  static async saveCredential(params: {
    verifiableCredential: W3CVerifiableCredential;
    store: AvailableCredentialStores | AvailableCredentialStores[];
  }): Promise<SaveCredentialRequestResult[]> {
    const { verifiableCredential, store } = params;

    const normalizedCredential = normalizeCredential(verifiableCredential);

    const result = await VeramoService.instance.save({
      data: normalizedCredential,
      options: { store },
    });

    const vcs = new Map<string, SaveCredentialRequestResult>();

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

  /**
   * Function that deletes a Verifiable Credential
   * @param params.id - ID of the Verifiable Credential to delete
   * @param params.store - Store to delete the Verifiable Credential from
   * @returns Array of booleans indicating if the Verifiable Credential was deleted
   * _**Note**: Currently only supports deleting 1 VC at a time_
   */
  static async deleteCredential(params: {
    id: string;
    store?: AvailableCredentialStores | AvailableCredentialStores[];
  }): Promise<boolean[]> {
    const { id, store } = params;

    const result = await VeramoService.instance.delete({
      id,
      ...(store ? { options: { store } } : {}),
    });

    return result;
  }

  /**
   * Function that queries Verifiable Credentials
   * @param params.options - Query options
   * @param params.filter - Query filter
   * @returns Array of Verifiable Credentials
   */
  static async queryCredentials(params: {
    options: QueryCredentialsOptions;
    filter?: Filter;
  }): Promise<QueryCredentialsRequestResult[]> {
    const { options, filter } = params;
    const result = await VeramoService.instance.query({
      filter,
      options,
    });

    const vcs = new Map<string, QueryCredentialsRequestResult>();

    for (const vc of result) {
      if (options.returnStore && !vc.metadata.store) {
        throw new Error('Missing store in VC metadata');
      }

      const existingVC = vcs.get(vc.metadata.id);
      if (existingVC) {
        if (options.returnStore) {
          existingVC.metadata.store?.push(vc.metadata.store!);
        }
      } else {
        vcs.set(vc.metadata.id, {
          data: vc.data as VerifiableCredential,
          metadata: {
            id: vc.metadata.id,
            ...(options.returnStore && {
              store: [vc.metadata.store!],
            }),
          },
        });
      }
    }
    return [...vcs.values()];
  }

  /**
   * Function that clears Verifiable Credentials
   * @param params.store - Store to clear Verifiable Credentials from
   * @param params.filter - Query filter
   * @returns Array of booleans indicating if the Verifiable Credential was deleted
   */
  static async clearCredentials(params: {
    store?: AvailableCredentialStores | AvailableCredentialStores[];
    filter?: Filter;
  }): Promise<boolean[]> {
    const { store, filter } = params;

    const result = await VeramoService.instance.clear({
      filter,
      ...(store ? { options: { store } } : {}),
    });

    return result;
  }

  /**
   * Function that creates a Verifiable Presentation
   * @param params.vcs - Array of Verifiable Credentials to include in the Verifiable Presentation
   * @param params.proofFormat - Proof format to use
   * @param params.proofOptions - Proof options
   * @returns Verifiable Presentation
   */
  static async createPresentation(
    params: CreatePresentationRequestParams
  ): Promise<VerifiablePresentation> {
    const {
      vcs,
      proofFormat = 'jwt',
      proofOptions,
      presentationFrame = [],
    } = params;
    const domain = proofOptions?.domain;
    const challenge = proofOptions?.challenge;
    const identifier = await VeramoService.getIdentifier();

    if (proofFormat === 'sd-jwt') {
      const presentations = await Promise.all(
        vcs.map(async (vc) => {
          if (typeof vc === 'object' && 'id' in vc && 'encodedVc' in vc) {
            // filter keys only for this VC
            const presentationKeys = presentationFrame
              .filter((claimKey) => vc.id === claimKey.split('/')[0])
              .map((claimKey) => claimKey.split('/')[1])
              .filter(Boolean);

            const presentation = await VeramoService.createPresentationSdJwt({
              encodedSdJwtVc: vc.encodedVc,
              presentationFrame: presentationKeys as string[],
            });

            return presentation.res.presentation;
          }
        })
      );

      const combinedPresentations = {
        presentations: presentations.map((presentation) => {
          return {
            presentation: presentation,
          };
        }),
        proof: {
          type: 'sd-jwt',
        },
      };

      return combinedPresentations as any;
    }

    return VeramoService.instance.createVerifiablePresentation({
      presentation: {
        holder: identifier.did,
        type: ['VerifiablePresentation', 'Custom'],
        verifiableCredential: vcs as W3CVerifiableCredential[],
      },
      proofFormat,
      domain,
      challenge,
    });
  }

  /**
   * Creates a presentation SD-JWT (Selective Disclosure JSON Web Token) from the given encoded SD-JWT VC (Verifiable Credential).
   *
   * @param params - An object containing the encoded SD-JWT VC.
   * @param params.encodedSdJwtVc - The encoded SD-JWT VC to be used for creating the presentation.
   * @param params.presentationFrame - The presentation frame to be used for creating the presentation.
   * @returns A promise that resolves to the created SD-JWT VC presentation.
   */
  static async createPresentationSdJwt(params: {
    encodedSdJwtVc: string;
    presentationFrame: string[];
  }): Promise<any> {
    const { encodedSdJwtVc, presentationFrame } = params;

    const presentationKeys =
      await VeramoService.createPresentationFrame(presentationFrame);

    const res = await VeramoService.instance.createSdJwtVcPresentation({
      presentation: encodedSdJwtVc,
      presentationKeys: {
        credentialSubject: presentationKeys,
      },
    });

    return { res, proof: { type: 'sd-jwt' } };
  }

  /**
   * Decodes a given SD-JWT presentation string and returns the corresponding SdJwtCredential.
   *
   * @param presentation - The SD-JWT presentation string to be decoded.
   * @returns A promise that resolves to an SdJwtCredential object.
   */
  static async decodeSdJwtPresentation(
    params: DecodeSdJwtPresentationRequestParams
  ): Promise<SdJwtCredential[]> {
    const credentials: SdJwtCredential[] = [];

    const mapDisclosures = (disclosures: any[] = []) =>
      disclosures.map((disclosure) => ({
        key: disclosure.key ?? '',
        salt: disclosure.salt,
        value: disclosure.value as string,
        digest: disclosure._digest ?? '',
        encoded: disclosure.encode(),
      }));

    params.presentation.map(async (vp) => {
      const res = await VeramoService.instance.decodeSdJwt(vp);

      const payload = res.jwt?.payload;
      const signature = res.jwt?.signature ?? '';
      const disclosures = mapDisclosures(res.disclosures);

      const vc = VeramoService.createSdJwtCredentialFromPayload(
        payload,
        signature,
        disclosures
      );

      credentials.push(vc);
    });

    return credentials;
  }

  /**
   * Helper function to convert a jwt VC payload to SdJwtCredential
   * @param vc - The VC payload
   * @param jwt - The JWT response containing signature
   * @returns SdJwtCredential
   */
  private static createSdJwtCredentialFromPayload(
    vc: any,
    signature: string,
    disclosures: Disclosure[]
  ): SdJwtCredential {
    const sdJwtVc: SdJwtCredential = {
      iss: typeof vc.iss === 'string' ? vc.iss : '',
      iat: typeof vc.iat === 'number' ? vc.iat : '',
      sub: typeof vc.sub === 'string' ? vc.sub : '',
      vct: typeof vc.vct === 'string' ? vc.vct : '',
      '@context': Array.isArray(vc['@context'])
        ? (vc['@context'] as string[])
        : [],
      credentialSchema:
        typeof vc.credentialSchema === 'object' && vc.credentialSchema !== null
          ? {
              id: (vc.credentialSchema as Record<string, unknown>)
                ?.id as string,
              type: (vc.credentialSchema as Record<string, unknown>)
                ?.type as string,
            }
          : {
              id: '',
              type: '',
            },
      credentialSubject:
        typeof vc.credentialSubject === 'object' &&
        vc.credentialSubject !== null
          ? (vc.credentialSubject as Record<string, unknown>)
          : {},
      _sd_alg: typeof vc._sd_alg === 'string' ? vc._sd_alg : '',
      id: typeof vc.id === 'string' ? vc.id : '',
      signature: typeof signature === 'string' ? signature : '',
      disclosures: disclosures.map((disclosure) => ({
        key: disclosure.key,
        salt: disclosure.salt,
        value: disclosure.value,
        digest: disclosure.digest,
        encoded: disclosure.encoded,
      })),
    };

    return sdJwtVc;
  }

  /**
   * Converts an array of claim names into a nested PresentationFrame object.
   * @param claims - Array of claim names (e.g., ['id', 'data.list.0.r']).
   * @returns A nested PresentationFrame object.
   */
  static async createPresentationFrame(
    claims: string[]
  ): Promise<PresentationFrame<Record<string, boolean>>> {
    const frame: any = {};

    claims.forEach((claim) => {
      // Split nested claims by '.'
      const keys = claim.split('.');
      // Start from the root
      let current = frame;

      // Build the nested structure
      keys.forEach((key, index) => {
        if (!current[key]) {
          // If last key, set to true, otherwise set to an empty object
          current[key] = index === keys.length - 1 ? true : {};
        }
        current = current[key]; // Traverse deeper
      });
    });

    return frame as PresentationFrame<Record<string, boolean>>;
  }

  /**
   * Function that creates an unsigned Verifiable Presentation
   * @param params.credentials - Array of Verifiable Credentials to include in the Verifiable Presentation
   * @returns Unsigned Verifiable Presentation
   */
  static async createUnsignedPresentation(params: {
    credentials: W3CVerifiableCredential[];
  }): Promise<UnsignedPresentation> {
    const { credentials } = params;

    const { did } = await VeramoService.getIdentifier();

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

  /**
   * Function that verifies a Verifiable Credentaial or Verifiable Presentation
   * @param params.credential - Verifiable Credential to verify
   * @param params.presentation - Verifiable Presentation to verify
   * @param params.verbose - Verbose mode
   * @returns Verification result
   */
  static async verifyData(
    params: VerifyDataRequestParams
  ): Promise<IVerifyResult> {
    const { credential, presentation } = params;

    let result: Result<VerificationResult> | undefined = undefined;
    if (credential) {
      result = await VerificationService.verify(credential);
    } else if (presentation) {
      result = await VerificationService.verify(presentation);
    }

    if (!result) throw new Error('No valid credential or presentation.');

    if (isError(result)) {
      throw new Error(result.error);
    }

    return result.data as IVerifyResult;
  }

  static async handleOIDCCredentialOffer(params: {
    credentialOfferURI: string;
  }): Promise<VerifiableCredential> {
    const state = StorageService.get();

    const identifier = await VeramoService.getIdentifier();
    const { did } = identifier;

    if (did.startsWith('did:ethr') || did.startsWith('did:pkh')) {
      throw new Error('did:ethr and did:pkh are not supported');
    }

    const agent = VeramoService.getAgent();

    const credentialOfferResult = await agent.parseOIDCCredentialOfferURI({
      credentialOfferURI: params.credentialOfferURI,
    });

    if (isError(credentialOfferResult)) {
      throw new Error(credentialOfferResult.error);
    }

    if (
      !(await UIService.handleCredentialOfferDialog(credentialOfferResult.data))
    ) {
      throw new Error('User denied credential offer');
    }

    const { credentials, grants } = credentialOfferResult.data;

    const res = WalletService.get();

    if (res === null) throw new Error('Could not get keys from address');

    // TODO: Is this fine or should we improve it ?
    const kid = `${identifier.did}#${identifier.did.split(':')[2]}`;

    const isDidKeyEbsi =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod === 'did:key:jwk_jcs-pub';

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

      const handleAuthorizationRequestResult =
        await VeramoService.handleAuthorizationRequest({
          authorizationRequestURI,
          did,
          customSign,
        });

      if (handleAuthorizationRequestResult.isUserInteractionRequired) {
        throw new Error(
          'User interaction is required. This is not supported yet'
        );
      }

      const { sendOIDCAuthorizationResponseArgs } =
        handleAuthorizationRequestResult;

      const sendAuthorizationResponseResult =
        await VeramoService.sendAuthorizationResponse(
          sendOIDCAuthorizationResponseArgs
        );

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
        pin = await UIService.getPinDialog();

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

    const credentialRequestResult =
      await agent.sendCredentialRequest(credentialRequest);

    if (isError(credentialRequestResult)) {
      throw new Error(credentialRequestResult.error);
    }

    const credentialResponse = credentialRequestResult.data;

    if (!credentialResponse.credential) {
      throw new Error('An error occurred while requesting the credential');
    }

    const credential = decodeCredentialToObject(credentialResponse.credential);

    return credential;
  }

  // TODO: We can probably have different return types
  static async handleOIDCAuthorizationRequest(params: {
    authorizationRequestURI: string;
  }): Promise<void> {
    const { authorizationRequestURI } = params;

    const state = StorageService.get();

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (did.startsWith('did:ethr') || did.startsWith('did:pkh')) {
      throw new Error('did:ethr and did:pkh are not supported');
    }
    const res = WalletService.get();

    if (res === null) throw new Error('Could not get keys from address');

    // TODO: Is this fine or should we improve it ?
    const kid = `${did}#${did.split(':')[2]}`;

    const isDidKeyEbsi =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod === 'did:key:jwk_jcs-pub';

    const customSign = async (signArgs: SignArgs) =>
      sign(signArgs, {
        privateKey: res.privateKey,
        curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
        did,
        kid,
      });

    const handleAuthorizationRequestResult =
      await VeramoService.handleAuthorizationRequest({
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

    const sendAuthorizationResponseResult =
      await VeramoService.sendAuthorizationResponse(
        sendOIDCAuthorizationResponseArgs
      );

    throw new Error('Not implemented');
  }

  // FIXME: This is a temporary solution (we need to refactor this)
  // the `handleOIDCAuthorizationRequest` method should be used instead and simplified
  static async handleAuthorizationRequest(params: {
    authorizationRequestURI: string;
    did: string;
    customSign: (args: SignArgs) => Promise<string>;
    credentials?: W3CVerifiableCredential[];
  }): Promise<
    {
      isUserInteractionRequired: boolean;
    } & (
      | {
          isUserInteractionRequired: true;
          credentials: W3CVerifiableCredential[];
          presentationDefinition: PresentationDefinition;
        }
      | {
          isUserInteractionRequired: false;
          sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs;
        }
    )
  > {
    const { authorizationRequestURI, did, customSign, credentials: _ } = params;
    const authorizationRequestResult =
      await VeramoService.instance.parseOIDCAuthorizationRequestURI({
        authorizationRequestURI,
      });

    if (isError(authorizationRequestResult)) {
      throw new Error(authorizationRequestResult.error);
    }

    if (
      !(await UIService.handleAuthorizationRequestDialog(
        authorizationRequestResult.data
      ))
    ) {
      throw new Error('User denied authorization request');
    }

    const authorizationRequest = authorizationRequestResult.data;
    const sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs =
      {};

    if (authorizationRequest.response_type.includes('vp_token')) {
      if (!authorizationRequest.presentation_definition) {
        throw new Error('presentation_definition is required');
      }

      // if(!credentials) {
      const store = ['snap'] as AvailableCredentialStores[];

      const queryResults = await VeramoService.queryCredentials({
        options: { store, returnStore: false },
      });

      const queriedCredentials: any = queryResults.map((result) => result.data);

      const selectCredentialsResult =
        await VeramoService.instance.selectCredentials({
          credentials: queriedCredentials,
        });

      if (isError(selectCredentialsResult)) {
        throw new Error(selectCredentialsResult.error);
      }

      const decodedCredentials = selectCredentialsResult.data.map(
        (credential) => decodeCredentialToObject(credential)
      );

      const createPresentationSubmissionResult =
        await VeramoService.instance.createPresentationSubmission({
          credentials: decodedCredentials as any,
        });

      if (isError(createPresentationSubmissionResult)) {
        throw new Error(createPresentationSubmissionResult.error);
      }

      const presentationSubmission = createPresentationSubmissionResult.data;

      const veramoPresentation =
        await VeramoService.instance.createVerifiablePresentation({
          presentation: {
            holder: did,
            verifiableCredential: decodedCredentials.map(
              (credential) => credential.proof.jwt
            ),
          },
          proofFormat: 'jwt',
        });

      const { '@context': context, holder, type } = veramoPresentation;

      const vp: UnsignedPresentation = {
        '@context': context,
        holder,
        type,
        verifiableCredential: decodedCredentials,
      };

      const createVpTokenResult = await VeramoService.instance.createVpToken({
        sign: customSign,
        vp,
      });

      if (isError(createVpTokenResult)) {
        throw new Error(createVpTokenResult.error);
      }

      const vpToken = createVpTokenResult.data;

      sendOIDCAuthorizationResponseArgs.presentationSubmission =
        presentationSubmission;
      sendOIDCAuthorizationResponseArgs.vpToken = vpToken;
    }

    if (authorizationRequest.response_type.includes('id_token')) {
      // Create id token
      const idTokenResult = await VeramoService.instance.createIdToken({
        sign: customSign,
      });

      if (isError(idTokenResult)) {
        throw new Error(idTokenResult.error);
      }

      const idToken = idTokenResult.data;

      sendOIDCAuthorizationResponseArgs.idToken = idToken;
    }

    return {
      isUserInteractionRequired: false,
      sendOIDCAuthorizationResponseArgs,
    };
  }

  static async sendAuthorizationResponse(
    params: SendOIDCAuthorizationResponseArgs
  ): Promise<{ code: string; state: string }> {
    // POST /auth-mock/direct_post
    const authorizationResponseResult =
      await VeramoService.instance.sendOIDCAuthorizationResponse(params);

    if (isError(authorizationResponseResult)) {
      throw new Error(authorizationResponseResult.error);
    }

    const authorizationResponse = authorizationResponseResult.data;

    const authorizationResponseData: any = qs.parse(
      authorizationResponse.split('?')[1]
    );

    if (!authorizationResponseData.code) {
      throw new Error('Authorization code is required');
    }

    if (!authorizationResponseData.state) {
      throw new Error('State is required');
    }

    return {
      code: authorizationResponseData.code as string,
      state: authorizationResponseData.state as string,
    };
  }

  /**
   * Function to create a new Veramo agent
   * @returns Veramo agent
   */
  static async createAgent(): Promise<Agent> {
    const didProviders: Record<string, AbstractIdentifierProvider> = {};
    const vcStorePlugins: Record<string, AbstractDataStore> = {};
    const enabledCredentialStores =
      await GeneralService.getEnabledCredentialStores();

    const networks: any = [
      {
        name: '',
        provider: new BrowserProvider(ethereum as any),
      },
      {
        name: 'mainnet',
        provider: new BrowserProvider(ethereum as any),
      },
      {
        name: 'sepolia',
        provider: new BrowserProvider(ethereum as any),
        registry: '0x03d5003bf0e79c5f5223588f347eba39afbc3818',
      },
    ];

    didProviders['did:ethr'] = new EthrDIDProvider({
      defaultKms: 'web3',
      networks,
    });

    didProviders['did:key'] = new KeyDIDProvider({ defaultKms: 'web3' });
    didProviders['did:pkh'] = new PkhDIDProvider({ defaultKms: 'web3' });
    didProviders['did:jwk'] = new JwkDIDProvider({ defaultKms: 'web3' });

    vcStorePlugins.snap = new SnapCredentialStore();
    if (enabledCredentialStores.includes('ceramic')) {
      vcStorePlugins.ceramic = new CeramicCredentialStore();
    }

    UniversalResolverService.init();

    return createAgent<
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
          // TODO implement This
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
            ...ensDidResolver({
              networks: networks as unknown as ProviderConfiguration[],
            }),
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
  }

  static getAgent(): Agent {
    return VeramoService.instance;
  }
}

export default VeramoService;
