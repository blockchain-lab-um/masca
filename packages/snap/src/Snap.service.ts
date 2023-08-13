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
  UnsignedCredential,
  UnsignedPresentation,
  VerifiableCredential,
  W3CVerifiableCredential,
} from '@veramo/core';
import { VerifiablePresentation } from 'did-jwt-vc';

import GeneralService from './General.service';
import PolygonService from './polygon-id/Polygon.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import VeramoService from './veramo/Veramo.service';
import WalletService from './Wallet.service';

class SnapService {
  private static origin: string;

  /**
   * Function that queries VCs from the selected VC stores.
   * @param args.filter.type - Type of filter (eg. JSONPath).
   * @param args.filter.filter - Filter to apply.
   * @param args.options.store - VC store to query.
   * @param args.options.returnStore - Whether to return the store name.
   * @returns array - Array of VCs.
   */
  static async queryCredentials(
    args: QueryCredentialsRequestParams
  ): Promise<QueryCredentialsRequestResult[]> {
    const { filter, options } = args ?? {};
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

    if (vcs.length > 0) {
      if (await UIService.queryAllDialog(vcs)) {
        return vcs;
      }
      throw new Error('User rejected query credentials request.');
    }
    return [];
  }

  /**
   * Function that saves a VC to the selected VC stores.
   * @param args.verifiableCredential - VC to save.
   * @param args.options.store - VC store to save to.
   * @returns array - Array of SaveVCRequestResult with id and the store the VC is saved in.
   */
  static async saveCredential(
    args: SaveCredentialRequestParams
  ): Promise<SaveCredentialRequestResult[]> {
    const { verifiableCredential, options } = args;
    const { store = 'snap' } = options ?? {};

    if (await UIService.saveCredentialDialog(store, verifiableCredential)) {
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
   * @param args.minimalUnsignedCredential - Minimal unsigned VC.
   * @param args.proofFormat - Proof format to use.
   * @param args.options.save - Whether to save the VC.
   * @param args.options.store - VC store to save to.
   * @returns UnsignedCredential | VerifiableCredential - Created VC.
   */
  static async createCredential(
    args: CreateCredentialRequestParams
  ): Promise<UnsignedCredential | VerifiableCredential> {
    const { minimalUnsignedCredential, proofFormat, options } = args;
    const { store = 'snap' } = options ?? {};
    const { save } = options ?? {};
    const state = StorageService.get();

    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (method === 'did:ethr' || method === 'did:pkh') {
      const unsignedVc = await VeramoService.createUnsignedCredential({
        credential: minimalUnsignedCredential,
      });

      return unsignedVc;
    }

    let storeString = '';
    if (save === true) {
      storeString = `Store(s): **${
        typeof store === 'string' ? store : store.join(', ')
      }**`;
    }

    const vc = await VeramoService.createCredential({
      credential: minimalUnsignedCredential,
      proofFormat,
    });

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (await UIService.createCredentialDialog(save, storeString, vc, did)) {
      if (save === true) {
        await VeramoService.saveCredential({
          verifiableCredential: vc,
          store,
        });
      }
      return vc;
    }
    throw new Error('User rejected create credential request');
  }

  /**
   * Function that deletes a VC from the selected VC stores.
   * @param args.id - ID of the VC to delete.
   * @param args.options.store - VC store to delete from.
   * @returns array - Array of booleans indicating whether the VC was deleted.
   */
  static async deleteCredential(
    args: DeleteCredentialsRequestParams
  ): Promise<boolean[]> {
    const { id, options } = args ?? {};
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

    if (vcs.length === 0) throw new Error('No VC found with the given id');

    let stores = 'All';
    if (store) {
      if (typeof store === 'string') stores = store;
      else stores = store.join(', ');
    }

    if (await UIService.deleteCredentialDialog(stores, vcs)) {
      if (polygonCredentials.length > 0) {
        await PolygonService.deleteCredential(id);
        return [true];
      }

      if (veramoCredentials.length > 0) {
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
   * @param args.vcs - VCs to include in the VP.
   * @param args.proofFormat - Proof format to use.
   * @param args.proofOptions.type - Type of proof.
   * @param args.proofOptions.domain - Proof domain.
   * @param args.proofOptions.challenge - Proof challenge.
   * @returns UnsignedPresentation | VerifiablePresentation - Created VP.
   */
  static async createPresentation(
    args: CreatePresentationRequestParams
  ): Promise<UnsignedPresentation | VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = args;
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (vcs.length === 0) {
      throw new Error('No credentials provided');
    }

    if (method === 'did:ethr' || method === 'did:pkh') {
      if (proofFormat !== 'EthereumEip712Signature2021') {
        throw new Error('proofFormat must be EthereumEip712Signature2021');
      }

      const unsignedVp = await VeramoService.createUnsignedPresentation({
        credentials: args.vcs,
      });

      return unsignedVp;
    }

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (await UIService.createPresentationDialog(vcs, did)) {
      const res = await VeramoService.createPresentation({
        vcs,
        proofFormat,
        proofOptions,
      });

      return res;
    }

    throw new Error('User rejected create presentation request.');
  }

  /**
   * Function that verifies data.
   * @param args.credential - VC to verify.
   * @param args.presentation - VP to verify.
   * @param args.verbose - Whether to return the full verification resul
   * @returns boolean | IVerifyResult - Whether the data is verified.
   */
  static async verifyData(
    args: VerifyDataRequestParams
  ): Promise<boolean | IVerifyResult> {
    const verbose = args.verbose || false;

    const res = await VeramoService.verifyData(args);

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
   * @param args.did - DID to resolve.
   * @returns DIDResolutionResult - result.
   */
  static async resolveDID(args: { did: string }): Promise<DIDResolutionResult> {
    if (args.did === '') throw new Error('DID cannot be empty');
    const res = await VeramoService.resolveDID(args.did);
    return res;
  }

  /**
   * Function that handles a credential offer.
   * @param args.credentialOffer - Credential offer to handle.
   * @returns VerifiableCredential[] - Array of VCs.
   */
  static async handleCredentialOffer(
    args: HandleCredentialOfferRequestParams
  ): Promise<VerifiableCredential[]> {
    const { credentialOffer } = args;

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
   * @param args.authorizationRequest - Authorization request to handle.
   * @returns void
   */
  static async handleAuthorizationRequest(
    args: HandleAuthorizationRequestParams
  ): Promise<void> {
    const { authorizationRequest } = args;

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
        await GeneralService.addFriendlyDapp(this.origin);
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
