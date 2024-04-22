import type { W3CCredential } from '@0xpolygonid/js-sdk';
import {
  CURRENT_STATE_VERSION,
  type CreateCredentialRequestParams,
  type CreatePresentationRequestParams,
  type DeleteCredentialsRequestParams,
  type HandleAuthorizationRequestParams,
  type HandleCredentialOfferRequestParams,
  type QueryCredentialsRequestParams,
  type QueryCredentialsRequestResult,
  type SaveCredentialRequestParams,
  type SaveCredentialRequestResult,
  type VerifyDataRequestParams,
  isPolygonSupportedMethods,
  isValidAddDappSettingsRequest,
  isValidChangePermissionRequest,
  isValidCreateCredentialRequest,
  isValidCreatePresentationRequest,
  isValidDeleteCredentialsRequest,
  isValidImportStateBackupRequest,
  isValidQueryCredentialsRequest,
  isValidRemoveDappSettingsRequest,
  isValidResolveDIDRequest,
  isValidSaveCredentialRequest,
  isValidSetCredentialStoreRequest,
  isValidSignDataRequest,
  isValidSwitchMethodRequest,
  isValidVerifyDataRequest,
  isVeramoSupportedMethods,
  polygonSupportedMethods,
} from '@blockchain-lab-um/masca-types';
import { type Result, ResultObject } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  IVerifyResult,
  UnsignedCredential,
  UnsignedPresentation,
  VerifiableCredential,
  W3CVerifiableCredential,
} from '@veramo/core';
import type { VerifiablePresentation } from 'did-jwt-vc';

import GeneralService from './General.service';
import SignerService from './Signer.service';
import UIService from './UI.service';
import WalletService from './Wallet.service';
import PolygonService from './polygon-id/Polygon.service';
import StorageService from './storage/Storage.service';
import { isTrustedDomain } from './utils/permissions';
import VeramoService from './veramo/Veramo.service';

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

    if (!(await UIService.queryAllDialog())) {
      throw new Error('User rejected query credentials request');
    }

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
    return vcs;
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
   * @returns UnsignedCredential | VerifiableCredential - Created VC.
   */
  static async createCredential(
    params: CreateCredentialRequestParams
  ): Promise<UnsignedCredential | VerifiableCredential> {
    const { minimalUnsignedCredential, proofFormat, options } = params;
    const { store = 'snap' } = options ?? {};
    const { save } = options ?? {};
    const state = StorageService.get();

    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (method === 'did:ethr' || method === 'did:pkh' || method === 'did:ens') {
      const unsignedVc = await VeramoService.createUnsignedCredential({
        credential: minimalUnsignedCredential,
      });

      return unsignedVc;
    }

    let storeString = '';
    if (save === true) {
      storeString = `Data store(s): **${
        typeof store === 'string' ? store : store.join(', ')
      }**`;
    }

    const vc = await VeramoService.createCredential({
      credential: minimalUnsignedCredential,
      proofFormat,
    });

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (
      await UIService.createCredentialDialog({
        save,
        storeString,
        minimalUnsignedCredential: vc,
        did,
      })
    ) {
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
   * @returns UnsignedPresentation | VerifiablePresentation - Created VP.
   */
  static async createPresentation(
    params: CreatePresentationRequestParams
  ): Promise<UnsignedPresentation | VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = params;
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    if (!vcs.length) throw new Error('No credentials provided');

    if (method === 'did:ethr' || method === 'did:pkh' || method === 'did:ens') {
      if (proofFormat !== 'EthereumEip712Signature2021') {
        throw new Error('proofFormat must be EthereumEip712Signature2021');
      }

      const unsignedVp = await VeramoService.createUnsignedPresentation({
        credentials: vcs,
      });

      return unsignedVp;
    }

    const identifier = await VeramoService.getIdentifier();

    const { did } = identifier;

    if (await UIService.createPresentationDialog({ vcs, did })) {
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
    SnapService.origin = origin; // hostname

    let res;

    let trustedOrigin = origin;

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
        res = await SnapService.queryCredentials(params);
        return ResultObject.success(res);
      case 'saveCredential':
        isValidSaveCredentialRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        res = await SnapService.saveCredential(params);
        return ResultObject.success(res);
      case 'createCredential':
        isValidCreateCredentialRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        await VeramoService.importIdentifier();
        res = await SnapService.createCredential(params);
        return ResultObject.success(res);
      case 'createPresentation':
        isValidCreatePresentationRequest(params);
        await VeramoService.importIdentifier();
        res = await SnapService.createPresentation(params);
        return ResultObject.success(res);
      case 'deleteCredential':
        isValidDeleteCredentialsRequest(
          params,
          state[CURRENT_STATE_VERSION].currentAccount,
          state
        );
        await PolygonService.init();
        res = await SnapService.deleteCredential(params);
        return ResultObject.success(res);
      case 'getDID':
        res = await SnapService.getDID();
        return ResultObject.success(res);
      case 'resolveDID':
        isValidResolveDIDRequest(params);
        res = await SnapService.resolveDID(params);
        return ResultObject.success(res);
      case 'verifyData':
        isValidVerifyDataRequest(params);
        res = await SnapService.verifyData(params);
        return ResultObject.success(res);
      case 'handleCredentialOffer':
        res = await SnapService.handleCredentialOffer(params);
        return ResultObject.success(res);
      case 'handleAuthorizationRequest':
        await SnapService.handleAuthorizationRequest(params);
        return ResultObject.success(true);

      /**
       * General.service
       */
      case 'togglePopups':
        if (isTrustedDomain(origin)) {
          res = await GeneralService.togglePopups();
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to toggle popups.');
      case 'addTrustedDapp':
        // If the origin is masca.io, any HOSTNAME can be added. Expect parameter to be a hostname!
        if (isTrustedDomain(origin)) trustedOrigin = params.origin;
        await GeneralService.addTrustedDapp({ originHostname: trustedOrigin });
        return ResultObject.success(true);
      case 'removeTrustedDapp':
        if (!isTrustedDomain(origin) && origin !== params.origin)
          throw new Error('Unauthorized to remove other dApps');
        await GeneralService.removeTrustedDapp({
          originHostname: trustedOrigin,
        });
        return ResultObject.success(false);
      case 'changePermission':
        isValidChangePermissionRequest(params);

        if (isTrustedDomain(origin)) {
          res = await GeneralService.changePermission({
            originHostname: params.origin,
            method: params.method,
            value: params.value,
          });
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to change settings.');
      case 'addDappSettings':
        if (isTrustedDomain(origin)) {
          isValidAddDappSettingsRequest(params);
          res = await GeneralService.addDappSettings(params.origin);
          return ResultObject.success(true);
        }
        return ResultObject.error('Unauthorized to change settings.');
      case 'removeDappSettings':
        if (isTrustedDomain(origin)) {
          isValidRemoveDappSettingsRequest(params);
          res = await GeneralService.removeDappSettings(params.origin);
          return ResultObject.success(true);
        }
        return ResultObject.error('Unauthorized to change settings.');
      case 'switchDIDMethod':
        isValidSwitchMethodRequest(params);
        await GeneralService.switchDIDMethod(params);
        await WalletService.init();
        res = await SnapService.getDID();
        return ResultObject.success(res);
      case 'getSelectedMethod':
        res = await GeneralService.getSelectedMethod();
        return ResultObject.success(res);
      case 'getCredentialStore':
        res = await GeneralService.getCredentialStore();
        return ResultObject.success(res);
      case 'setCredentialStore':
        isValidSetCredentialStoreRequest(params);
        if (isTrustedDomain(origin)) {
          res = await GeneralService.setCredentialStore(params);
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to change credential store.');
      case 'getAvailableCredentialStores':
        res = await GeneralService.getAvailableCredentialStores();
        return ResultObject.success(res);
      case 'getAccountSettings':
        if (isTrustedDomain(origin)) {
          res = await GeneralService.getAccountSettings();
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to get account settings.');
      case 'getSnapSettings':
        if (isTrustedDomain(origin)) {
          res = await GeneralService.getSnapSettings();
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to get snap settings.');
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
        if (isTrustedDomain(origin)) {
          res = await WalletService.getWalletId();
          return ResultObject.success(res);
        }
        return ResultObject.error('Unauthorized to get wallet id.');

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
        throw new Error(`Method ${method} not found.`);
    }
  }
}

export default SnapService;
