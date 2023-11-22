import { W3CCredential } from '@0xpolygonid/js-sdk';
import {
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  CURRENT_STATE_VERSION,
  DeleteCredentialsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  isPolygonSupportedMethods,
  isValidCreateCredentialRequest,
  isValidCreatePresentationRequest,
  isValidDeleteCredentialsRequest,
  isValidImportStateBackupRequest,
  isValidQueryCredentialsRequest,
  isValidResolveDIDRequest,
  isValidSaveCredentialRequest,
  isValidSetCredentialStoreRequest,
  isValidSignDataRequest,
  isValidSwitchMethodRequest,
  isValidVerifyDataRequest,
  isVeramoSupportedMethods,
  polygonSupportedMethods,
  QueryCredentialsRequestParams,
  QueryCredentialsRequestResult,
  SaveCredentialRequestParams,
  SaveCredentialRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import { Result, ResultObject } from '@blockchain-lab-um/utils';
import {
  DIDResolutionResult,
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';
import { getEthTypesFromInputDoc } from 'eip-712-types-generation';

import GeneralService from './General.service';
import PolygonService from './polygon-id/Polygon.service';
import SignerService from './Signer.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import VeramoService from './veramo/Veramo.service';
import WalletService from './Wallet.service';

class SnapService {
  private static origin: string;

  /**
   * Function that queries VCs from the selected VC stores.
   * @param params.filter.type - Type of filter (eg. JSONPath).
   * @param params.filter.filter - Filter to apply.
   * @param params.options.store - VC store to query.
   * @param params.options.returnStore - Whether to return the store name.
   * @returns array - Array of VCs.
   */
  static async queryCredentials(
    params: QueryCredentialsRequestParams
  ): Promise<QueryCredentialsRequestResult[]> {
    const { filter, options } = params ?? {};
    const { store, returnStore = true } = options ?? {};

    // FIXME: Maybe do this in parallel? Does it make sense?
    const veramoCredentials = await VeramoService.queryCredentials({
      options: { store, returnStore },
      filter,
    });

    const polygonCredentials: QueryCredentialsRequestResult[] = (
      await PolygonService.queryCredentials()
    ).map((vc) => ({
      data: vc as VerifiableCredential,
      metadata: {
        id: vc.id,
        store: ['snap'],
      },
    }));

    const vcs = [...veramoCredentials, ...polygonCredentials];

    if (!vcs.length) return [];
    if (await UIService.queryAllDialog({ vcs })) {
      return vcs;
    }
    throw new Error('User rejected query credentials request.');
  }

  /**
   * Function that saves a VC to the selected VC stores.
   * @param params.verifiableCredential - VC to save.
   * @param params.options.store - VC store to save to.
   * @returns array - Array of SaveVCRequestResult with id and the store the VC is saved in.
   */
  static async saveCredential(
    params: SaveCredentialRequestParams
  ): Promise<SaveCredentialRequestResult[]> {
    const { verifiableCredential, options } = params;
    const { store = 'snap' } = options ?? {};

    if (await UIService.saveCredentialDialog({ store, verifiableCredential })) {
      // If it is a string handle with Veramo
      if (typeof verifiableCredential === 'string') {
        const res = await VeramoService.saveCredential({
          verifiableCredential,
          store,
        });
        return res;
      }

      const { id } = verifiableCredential.credentialSubject;

      // Check if credential subject id is a string (did)
      if (typeof id === 'string') {
        if (polygonSupportedMethods.some((method) => id.startsWith(method))) {
          await PolygonService.init();
          await PolygonService.saveCredential(
            verifiableCredential as W3CCredential
          );
          return [
            {
              id: (verifiableCredential as W3CCredential).id,
              store: ['snap'],
            },
          ];
        }

        return VeramoService.saveCredential({
          verifiableCredential: verifiableCredential as W3CVerifiableCredential,
          store,
        });
      }

      throw new Error('Unsupported Credential format');
    }

    throw new Error('User rejected save credential request.');
  }

  /**
   * Function that creates a VC.
   * @param params.minimalUnsignedCredential - Minimal unsigned VC.
   * @param params.proofFormat - Proof format to use.
   * @param params.options.save - Whether to save the VC.
   * @param params.options.store - VC store to save to.
   * @returns  VerifiableCredential - Created VC.
   */
  static async createCredential(
    params: CreateCredentialRequestParams
  ): Promise<VerifiableCredential> {
    const { minimalUnsignedCredential, proofFormat, options } = params;
    const { store = 'snap' } = options ?? {};
    const { save } = options ?? {};
    const state = StorageService.get();

    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    let credential;

    let storeString = '';
    if (save === true) {
      storeString = `Store(s): **${
        typeof store === 'string' ? store : store.join(', ')
      }**`;
    }

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (
      await UIService.createCredentialDialog({
        save,
        storeString,
        minimalUnsignedCredential,
        did,
      })
    ) {
      if (method === 'did:ethr' || method === 'did:pkh') {
        const unsignedCredential = await VeramoService.createUnsignedCredential(
          {
            credential: minimalUnsignedCredential,
          }
        );

        const addresses = (await window.ethereum.request({
          method: 'eth_requestAccounts',
        })) as string[];

        let issuer = '';
        if (typeof unsignedCredential.issuer === 'string') {
          issuer = unsignedCredential.issuer;
        } else {
          issuer = unsignedCredential.issuer.id;
        }

        if (!issuer.includes(addresses[0])) {
          throw new Error('Invalid Issuer');
        }

        const chainId = parseInt(
          (await window.ethereum.request({ method: 'eth_chainId' })) as string,
          16
        );

        // Add proof info to unsigned credential
        unsignedCredential.proof = {
          verificationMethod: `${issuer}#controller`,
          created: unsignedCredential.issuanceDate,
          proofPurpose: 'assertionMethod',
          type: 'EthereumEip712Signature2021',
        };

        const message = unsignedCredential;

        const domain = {
          chainId,
          name: 'VerifiableCredential',
          version: '1',
        };

        const primaryType = 'VerifiableCredential';
        const allTypes = getEthTypesFromInputDoc(
          unsignedCredential,
          primaryType
        );
        const types = { ...allTypes };

        const data = JSON.stringify({ domain, types, message, primaryType });

        // Sign typed data
        const signature = await window.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [addresses[0], data],
        });

        // Add signature to unsigned credential
        unsignedCredential.proof.proofValue = signature;

        // Add eip712 data to unsigned credential
        unsignedCredential.proof.eip712 = {
          domain,
          types: allTypes,
          primaryType,
        };

        credential = unsignedCredential as VerifiableCredential;
      } else {
        credential = await VeramoService.createCredential({
          credential: minimalUnsignedCredential,
          proofFormat,
        });
      }

      if (save === true) {
        await VeramoService.saveCredential({
          verifiableCredential: credential,
          store,
        });
      }
      return credential;
    }
    throw new Error('User rejected create credential request');
  }

  /**
   * Function that deletes a VC from the selected VC stores.
   * @param params.id - ID of the VC to delete.
   * @param params.options.store - VC store to delete from.
   * @returns array - Array of booleans indicating whether the VC was deleted.
   */
  static async deleteCredential(
    params: DeleteCredentialsRequestParams
  ): Promise<boolean[]> {
    const { id, options } = params ?? {};
    const store = options?.store;

    const veramoCredentials = await VeramoService.queryCredentials({
      options: { store },
      filter: { type: 'id', filter: id },
    });

    // FIXME: Implement filter
    const polygonCredentials: QueryCredentialsRequestResult[] = (
      await PolygonService.queryCredentials()
    )
      .map((vc) => ({
        data: vc as VerifiableCredential,
        metadata: {
          id: vc.id,
          store: ['snap'],
        },
      }))
      .filter((vc) => vc.metadata.id === id);

    const vcs = [...veramoCredentials, ...polygonCredentials];

    if (!vcs.length) throw new Error('No VC found with the given id');

    let stores = 'All';
    if (store) {
      if (typeof store === 'string') stores = store;
      else stores = store.join(', ');
    }

    if (await UIService.deleteCredentialDialog({ store: stores, vcs })) {
      if (polygonCredentials.length) {
        await PolygonService.deleteCredential(id);
        return [true];
      }

      if (veramoCredentials.length) {
        const res = await VeramoService.deleteCredential({
          id,
          store,
        });

        return res;
      }
    }

    throw new Error('User rejected delete credential request.');
  }

  /**
   * Function that creates a VP.
   * @param params.vcs - VCs to include in the VP.
   * @param params.proofFormat - Proof format to use.
   * @param params.proofOptions.type - Type of proof.
   * @param params.proofOptions.domain - Proof domain.
   * @param params.proofOptions.challenge - Proof challenge.
   * @returns  VerifiablePresentation - Created VP.
   */
  static async createPresentation(
    params: CreatePresentationRequestParams
  ): Promise<VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = params;
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (!vcs.length) throw new Error('No credentials provided');

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    let presentation;

    if (await UIService.createPresentationDialog({ vcs, did })) {
      if (method === 'did:ethr' || method === 'did:pkh') {
        if (proofFormat !== 'EthereumEip712Signature2021') {
          throw new Error('proofFormat must be EthereumEip712Signature2021');
        }

        const unsignedPresentation =
          await VeramoService.createUnsignedPresentation({
            credentials: vcs,
          });

        const addresses = (await ethereum.request({
          method: 'eth_requestAccounts',
        })) as string[];

        if (!unsignedPresentation.holder.includes(addresses[0])) {
          throw new Error('Wrong holder');
        }

        const chainId = parseInt(
          (await ethereum.request({ method: 'eth_chainId' })) as string,
          16
        );

        unsignedPresentation.proof = {
          verificationMethod: `${unsignedPresentation.holder}#controller`,
          created: unsignedPresentation.issuanceDate,
          proofPurpose: 'assertionMethod',
          type: 'EthereumEip712Signature2021',
        };

        const message = unsignedPresentation;

        const domain = {
          chainId,
          name: 'VerifiablePresentation',
          version: '1',
        };

        const primaryType = 'VerifiablePresentation';
        const types = getEthTypesFromInputDoc(
          unsignedPresentation,
          primaryType
        );

        const data = JSON.stringify({ domain, types, message, primaryType });

        const signature = await window.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [addresses[0], data],
        });

        // Add signature to unsigned presentation
        unsignedPresentation.proof.proofValue = signature;

        // Add eip712 data to unsigned presentation
        unsignedPresentation.proof.eip712 = {
          domain,
          types,
          primaryType,
        };

        presentation = unsignedPresentation as VerifiablePresentation;
      } else {
        presentation = await VeramoService.createPresentation({
          vcs,
          proofFormat,
          proofOptions,
        });
      }

      return presentation;
    }

    throw new Error('User rejected create presentation request.');
  }

  /**
   * Function that verifies data.
   * @param params.credential - VC to verify.
   * @param params.presentation - VP to verify.
   * @param params.verbose - Whether to return the full verification resul
   * @returns boolean | IVerifyResult - Whether the data is verified.
   */
  static async verifyData(
    params: VerifyDataRequestParams
  ): Promise<boolean | IVerifyResult> {
    const verbose = params.verbose || false;

    const res = await VeramoService.verifyData(params);

    if (res.error) throw new Error(res.error.message);
    return verbose ? res : res.verified;
  }

  /**
   * Function that returns the current DID.
   * @returns string - Current DID.
   */
  static async getDID(): Promise<string> {
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (isVeramoSupportedMethods(method)) {
      await VeramoService.importIdentifier();
      const identifier = await VeramoService.getIdentifier();
      return identifier.did;
    }

    if (isPolygonSupportedMethods(method)) {
      await PolygonService.init();
      await PolygonService.createOrImportIdentity();
      return PolygonService.getIdentifier();
    }

    throw new Error('Unsupported DID method');
  }

  /**
   * Function that resolves a DID.
   * @param params.did - DID to resolve.
   * @returns DIDResolutionResult - result.
   */
  static async resolveDID(params: {
    did: string;
  }): Promise<DIDResolutionResult> {
    const { did } = params;
    if (did === '') throw new Error('DID cannot be empty');
    const res = await VeramoService.resolveDID(did);
    return res;
  }

  /**
   * Function that handles a credential offer.
   * @param params.credentialOffer - Credential offer to handle.
   * @returns VerifiableCredential[] - Array of VCs.
   */
  static async handleCredentialOffer(
    params: HandleCredentialOfferRequestParams
  ): Promise<VerifiableCredential[]> {
    const { credentialOffer } = params;

    if (credentialOffer.startsWith('openid-credential-offer://')) {
      await VeramoService.importIdentifier();
      return [
        await VeramoService.handleOIDCCredentialOffer({
          credentialOfferURI: credentialOffer,
        }),
      ];
    }

    let parsedOffer;

    try {
      parsedOffer = JSON.parse(credentialOffer);
    } catch (e) {
      throw new Error('Failed to parse credential offer');
    }

    if (
      parsedOffer.type ===
      'https://iden3-communication.io/credentials/1.0/offer'
    ) {
      if (!(await UIService.handleCredentialOfferDialog(parsedOffer))) {
        throw new Error('User denied credential offer');
      }
      await PolygonService.init();
      await PolygonService.createOrImportIdentity();
      return (await PolygonService.handleCredentialOffer({
        credentialOffer,
      })) as VerifiableCredential[];
    }

    throw new Error('Unsupported credential offer');
  }

  /**
   * Function that handles an authorization request.
   * @param params.authorizationRequest - Authorization request to handle.
   * @returns void
   */
  static async handleAuthorizationRequest(
    params: HandleAuthorizationRequestParams
  ): Promise<void> {
    const { authorizationRequest } = params;

    if (authorizationRequest.startsWith('openid://')) {
      await VeramoService.importIdentifier();
      return VeramoService.handleOIDCAuthorizationRequest({
        authorizationRequestURI: authorizationRequest,
      });
    }

    let parsedOffer;

    try {
      parsedOffer = JSON.parse(authorizationRequest);
    } catch (e) {
      throw new Error('Failed to parse authorization request');
    }

    if (
      parsedOffer.type ===
      'https://iden3-communication.io/authorization/1.0/request'
    ) {
      if (!(await UIService.handleAuthorizationRequestDialog(parsedOffer))) {
        throw new Error('User denied authorization request');
      }

      await PolygonService.init();
      await PolygonService.createOrImportIdentity();
      return PolygonService.handleAuthorizationRequest({
        authorizationRequest,
      });
    }
    throw new Error('Unsupported authorization request');
  }

  /**
   * Function that handles an RPC request.
   * @param method - Function name to call.
   * @param params - Params to handle.
   * @param origin - Origin of the request.
   * @returns Result<any> - Result of the request.
   */
  static async handleRpcRequest(
    method: string,
    params: any,
    origin: string
  ): Promise<Result<any>> {
    this.origin = origin;

    let res;

    const state = StorageService.get();

    switch (method) {
      /**
       * Snap.service
       *
       * All methods need to be supported in:
       * - Veramo.service
       * - Polygon.service
       */
      case 'queryCredentials':
        isValidQueryCredentialsRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        await PolygonService.init();
        res = await this.queryCredentials(params);
        return ResultObject.success(res);
      case 'saveCredential':
        isValidSaveCredentialRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        res = await this.saveCredential(params);
        return ResultObject.success(res);
      case 'createCredential':
        isValidCreateCredentialRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        await VeramoService.importIdentifier();
        res = await this.createCredential(params);
        return ResultObject.success(res);
      case 'createPresentation':
        isValidCreatePresentationRequest(params);
        await VeramoService.importIdentifier();
        res = await this.createPresentation(params);
        return ResultObject.success(res);
      case 'deleteCredential':
        isValidDeleteCredentialsRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        await PolygonService.init();
        res = await this.deleteCredential(params);
        return ResultObject.success(res);
      case 'getDID':
        res = await this.getDID();
        return ResultObject.success(res);
      case 'resolveDID':
        isValidResolveDIDRequest(params);
        res = await this.resolveDID(params);
        return ResultObject.success(res);
      case 'verifyData':
        isValidVerifyDataRequest(params);
        res = await this.verifyData(params);
        return ResultObject.success(res);
      case 'handleCredentialOffer':
        res = await this.handleCredentialOffer(params);
        return ResultObject.success(res);
      case 'handleAuthorizationRequest':
        await this.handleAuthorizationRequest(params);
        return ResultObject.success(true);

      /**
       * General.service
       */
      case 'togglePopups':
        res = await GeneralService.togglePopups();
        return ResultObject.success(res);
      case 'addFriendlyDapp':
        await GeneralService.addFriendlyDapp({ id: this.origin });
        return ResultObject.success(true);
      case 'removeFriendlyDapp':
        await GeneralService.removeFriendlyDapp(params);
        return ResultObject.success(true);
      case 'switchDIDMethod':
        isValidSwitchMethodRequest(params);
        await GeneralService.switchDIDMethod(params);
        await WalletService.init();
        res = await this.getDID();
        return ResultObject.success(res);
      case 'getSelectedMethod':
        res = await GeneralService.getSelectedMethod();
        return ResultObject.success(res);
      case 'getCredentialStore':
        res = await GeneralService.getCredentialStore();
        return ResultObject.success(res);
      case 'setCredentialStore':
        isValidSetCredentialStoreRequest(params);
        res = await GeneralService.setCredentialStore(params);
        return ResultObject.success(res);
      case 'getAvailableCredentialStores':
        res = await GeneralService.getAvailableCredentialStores();
        return ResultObject.success(res);
      case 'getAccountSettings':
        res = await GeneralService.getAccountSettings();
        return ResultObject.success(res);
      case 'getSnapSettings':
        res = await GeneralService.getSnapSettings();
        return ResultObject.success(res);
      case 'getAvailableMethods':
        res = await GeneralService.getAvailableMethods();
        return ResultObject.success(res);
      case 'setCeramicSession':
        // TODO (andy) validate request paramss
        await GeneralService.setCeramicSession(params);
        return ResultObject.success(true);
      case 'validateStoredCeramicSession':
        await GeneralService.validateStoredCeramicSession();
        return ResultObject.success(true);
      case 'getWalletId':
        res = await WalletService.getWalletId();
        return ResultObject.success(res);

      /**
       * Signer.service
       */
      case 'signData': {
        isValidSignDataRequest(params);

        const didMethod =
          state[CURRENT_STATE_VERSION].accountState[
            state[CURRENT_STATE_VERSION].currentAccount
          ].general.account.ssi.selectedMethod;

        if (didMethod === 'did:polygonid' || didMethod === 'did:iden3') {
          await PolygonService.init();
          await PolygonService.createOrImportIdentity();
        } else {
          await VeramoService.importIdentifier();
        }

        let signedData;

        if (params.type === 'JWZ') {
          signedData = await SignerService.signData(params);
        } else {
          const { did } = await VeramoService.getIdentifier();
          const kid = VeramoService.getKid(did);

          signedData = await SignerService.signData({
            ...params,
            did,
            kid,
          });
        }

        return ResultObject.success(signedData);
      }

      /**
       * Storage.service
       */
      case 'exportStateBackup':
        res = await GeneralService.exportBackup();
        return ResultObject.success(res);
      case 'importStateBackup':
        isValidImportStateBackupRequest(params);
        await GeneralService.importBackup(params);
        return ResultObject.success(true);
      default:
        throw new Error('Method not found.');
    }
  }
}

export default SnapService;
