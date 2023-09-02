import {
  KeyDIDProvider,
  getDidKeyResolver as keyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  AvailableCredentialStores,
  CreatePresentationRequestParams,
  CURRENT_STATE_VERSION,
  Filter,
  MinimalUnsignedCredential,
  QueryCredentialsOptions,
  QueryCredentialsRequestResult,
  SaveCredentialRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import {
  IOIDCClientPlugin,
  OIDCClientPlugin,
  SendOIDCAuthorizationResponseArgs,
  SignArgs,
} from '@blockchain-lab-um/oidc-client-plugin';
import {
  CredentialRequest,
  PresentationDefinition,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import {
  AbstractDataStore,
  DataManager,
  IDataManager,
} from '@blockchain-lab-um/veramo-datamanager';
import { Web3Provider } from '@ethersproject/providers';
import {
  createAgent,
  CredentialPayload,
  CredentialStatus,
  ICredentialIssuer,
  ICredentialVerifier,
  IDataStore,
  IDIDManager,
  IIdentifier,
  IKeyManager,
  IResolver,
  IVerifyResult,
  ProofFormat,
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
import * as qs from 'qs';

import EthereumService from '../Ethereum.service';
import GeneralService from '../General.service';
import StorageService from '../storage/Storage.service';
import UIService from '../UI.service';
import UniversalResolverService from '../UniversalResolver.service';
import { normalizeCredential } from '../utils/credential';
import { sign } from '../utils/sign';
import WalletService from '../Wallet.service';
import { CeramicCredentialStore } from './plugins/ceramicDataStore/ceramicDataStore';
import { SnapCredentialStore } from './plugins/snapDataStore/snapDataStore';

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
    this.instance = await this.createAgent();
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
      case 'did:ethr': {
        return;
      }
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        // Import into wallet
        const res = WalletService.get();

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
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        const { alias: _, ...identifier } =
          await this.instance.didManagerGetByAlias({
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
   * Function that resolves a DID
   * @param did - DID to resolve
   * @returns DID resolution result
   */
  static async resolveDID(did: string): Promise<DIDResolutionResult> {
    return this.instance.resolveDid({ didUrl: did });
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

    credential.issuer = identifier.did;

    const vc = await this.instance.createVerifiableCredential({
      credential: credential as CredentialPayload,
      proofFormat,
    });

    return vc;
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

    const result = await this.instance.save({
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

    const result = await this.instance.delete({
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
    const result = await this.instance.query({
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

    const result = await this.instance.clear({
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
    const { vcs, proofFormat = 'jwt', proofOptions } = params;
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

  /**
   * Function that creates an unsigned Verifiable Presentation
   * @param params.credentials - Array of Verifiable Credentials to include in the Verifiable Presentation
   * @returns Unsigned Verifiable Presentation
   */
  static async createUnsignedPresentation(params: {
    credentials: W3CVerifiableCredential[];
  }): Promise<UnsignedPresentation> {
    const { credentials } = params;

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
    try {
      const { credential, presentation } = params;

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
        await this.handleAuthorizationRequest({
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
        await this.sendAuthorizationResponse(sendOIDCAuthorizationResponseArgs);

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

    const credentialRequestResult = await agent.sendCredentialRequest(
      credentialRequest
    );

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
      await this.handleAuthorizationRequest({
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
      await this.sendAuthorizationResponse(sendOIDCAuthorizationResponseArgs);

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
      await this.instance.parseOIDCAuthorizationRequestURI({
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

      const selectCredentialsResult = await this.instance.selectCredentials({
        credentials: queriedCredentials,
      });

      if (isError(selectCredentialsResult)) {
        throw new Error(selectCredentialsResult.error);
      }

      //   return {
      //     isUserInteractionRequired: true,
      //     credentials: selectCredentialsResult.data,
      //     presentationDefinition: authorizationRequest.presentation_definition,
      //   }
      // }

      // const selectCredentialsResult = await agent.selectCredentials({
      //   credentials: credentials as any,
      // });

      // if (isError(selectCredentialsResult)) {
      //   throw new Error(selectCredentialsResult.error);
      // }

      const createPresentationSubmissionResult =
        await this.instance.createPresentationSubmission({
          credentials: selectCredentialsResult.data,
        });

      if (isError(createPresentationSubmissionResult)) {
        throw new Error(createPresentationSubmissionResult.error);
      }

      const presentationSubmission = createPresentationSubmissionResult.data;

      const decodedCredentials = selectCredentialsResult.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (credential) => decodeCredentialToObject(credential).proof.jwt
      );

      const veramoPresentation =
        await this.instance.createVerifiablePresentation({
          presentation: {
            holder: did,
            verifiableCredential: decodedCredentials,
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

      const createVpTokenResult = await this.instance.createVpToken({
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
      const idTokenResult = await this.instance.createIdToken({
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
      await this.instance.sendOIDCAuthorizationResponse(params);

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

    vcStorePlugins.snap = new SnapCredentialStore();
    if (enabledCredentialStores.includes('ceramic')) {
      vcStorePlugins.ceramic = new CeramicCredentialStore();
    }

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
    return this.instance;
  }
}

export default VeramoService;
