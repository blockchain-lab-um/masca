import { W3CCredential } from '@0xpolygonid/js-sdk';
import {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  isPolygonSupportedMethods,
  isValidCreateVCRequest,
  isValidCreateVPRequest,
  isValidDeleteVCsRequest,
  isValidQueryVCsRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
  isValidVerifyDataRequest,
  isVeramoSupportedMethods,
  polygonSupportedMethods,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SaveVCRequestParams,
  SaveVCRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import { Result, ResultObject } from '@blockchain-lab-um/utils';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
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
import { snapConfirm } from './utils/snapUtils';
import VeramoService from './veramo/Veramo.service';
import WalletService from './Wallet.service';

class SnapService {
  private static origin: string;

  static async queryCredentials(
    args: QueryVCsRequestParams
  ): Promise<QueryVCsRequestResult[]> {
    const { filter, options } = args ?? {};
    const { store, returnStore = true } = options ?? {};

    // FIXME: Maybe do this in parallel? Does it make sense?
    const veramoCredentials = await VeramoService.queryCredentials({
      options: { store, returnStore },
      filter,
    });

    const polygonCredentials: QueryVCsRequestResult[] = (
      await PolygonService.queryCredentials()
    ).map((vc) => ({
      data: vc as VerifiableCredential,
      metadata: {
        id: vc.id,
        store: ['snap'],
      },
    }));

    const vcs = [...veramoCredentials, ...polygonCredentials];

    const content = panel([
      heading('Share VCs'),
      text('Are you sure you want to share VCs with this dApp?'),
      divider(),
      text(
        `Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your VCs! Number of VCs submitted is ${vcs.length.toString()}`
      ),
      text('This popup will not appear again for this dApp.'),
    ]);

    if (
      (await GeneralService.isFriendlyDapp(this.origin)) ||
      (await snapConfirm(content))
    ) {
      await GeneralService.addFriendlyDapp(this.origin);
      return vcs;
    }

    throw new Error('User rejected the request.');
  }

  static async saveCredential(
    args: SaveVCRequestParams
  ): Promise<SaveVCRequestResult[]> {
    const { verifiableCredential, options } = args;
    const { store = 'snap' } = options ?? {};

    const content = panel([
      heading('Save VC'),
      text('Would you like to save the following VC?'),
      divider(),
      text(`Store(s): ${typeof store === 'string' ? store : store.join(', ')}`),
      text(`VC:`),
      copyable(JSON.stringify(verifiableCredential, null, 2)),
    ]);

    if (await snapConfirm(content)) {
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

    throw new Error('User rejected the request.');
  }

  static async createCredential(
    args: CreateVCRequestParams
  ): Promise<UnsignedCredential | VerifiableCredential> {
    const { minimalUnsignedCredential, proofFormat, options } = args;
    const { store = 'snap' } = options ?? {};
    const { save } = options ?? {};
    const state = StorageService.get();

    const method =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod;

    if (method === 'did:ethr' || method === 'did:pkh') {
      const unsignedVc = await VeramoService.createUnsignedCredential({
        credential: minimalUnsignedCredential,
      });

      return unsignedVc;
    }

    const vc = await VeramoService.createCredential({
      credential: minimalUnsignedCredential,
      proofFormat,
    });

    if (save === true) {
      const content = panel([
        heading('Save VC'),
        text('Would you like to save the following VC?'),
        divider(),
        text(
          `Store(s): ${typeof store === 'string' ? store : store.join(', ')}`
        ),
        text(`VC:`),
        copyable(JSON.stringify(vc, null, 2)),
      ]);

      if (await snapConfirm(content)) {
        await VeramoService.saveCredential({
          verifiableCredential: vc,
          store,
        });
      }
    }

    return vc;
  }

  static async deleteCredential(
    args: DeleteVCsRequestParams
  ): Promise<boolean[]> {
    const { id, options } = args ?? {};
    const store = options?.store;

    const veramoCredentials = await VeramoService.queryCredentials({
      options: { store },
      filter: { type: 'id', filter: id },
    });

    // FIXME: Implement filter
    const polygonCredentials: QueryVCsRequestResult[] = (
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
    const content = panel([
      heading('Delete VC'),
      text('Are you sure you want to delete this VC?'),
      divider(),
      text(`Store: ${stores}`),
      text(`VCs: ${JSON.stringify(vcs, null, 2)}`),
    ]);

    if (await snapConfirm(content)) {
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

    throw new Error('User rejected the request.');
  }

  static async createPresentation(
    args: CreateVPRequestParams
  ): Promise<UnsignedPresentation | VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = args;
    const state = StorageService.get();
    const method =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod;

    if (vcs.length === 0) {
      throw new Error('No credentials provided');
    }

    const content = panel([
      heading('Create VP'),
      text('Would you like to create a VP from the following VC(s)?'),
      divider(),
      text(`VC(s):`),
      ...vcs.map((vc) => copyable(JSON.stringify(vc, null, 2))),
    ]);

    if (state.snapConfig.dApp.disablePopups || (await snapConfirm(content))) {
      if (method === 'did:ethr' || method === 'did:pkh') {
        if (proofFormat !== 'EthereumEip712Signature2021') {
          throw new Error('proofFormat must be EthereumEip712Signature2021');
        }

        const unsignedVp = await VeramoService.createUnsignedPresentation({
          credentials: args.vcs,
        });

        return unsignedVp;
      }

      const res = await VeramoService.createPresentation({
        vcs,
        proofFormat,
        proofOptions,
      });

      return res;
    }

    throw new Error('User rejected create VP request');
  }

  static async verifyData(
    args: VerifyDataRequestParams
  ): Promise<boolean | IVerifyResult> {
    const verbose = args.verbose || false;

    const res = await VeramoService.verifyData(args);

    if (res.error) throw new Error(res.error.message);
    return verbose ? res : res.verified;
  }

  static async getDID(): Promise<string> {
    const state = StorageService.get();
    const method =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod;

    console.log('method', method);
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

  static async resolveDID(args: { did: string }): Promise<DIDResolutionResult> {
    if (args.did === '') throw new Error('DID cannot be empty');
    const res = await VeramoService.resolveDID(args.did);
    return res;
  }

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
      await PolygonService.init();
      await PolygonService.createOrImportIdentity();
      return (await PolygonService.handleCredentialOffer({
        credentialOffer,
      })) as VerifiableCredential[];
    }

    throw new Error('Unsupported credential offer');
  }

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
      await PolygonService.init();
      await PolygonService.createOrImportIdentity();
      return PolygonService.handleAuthorizationRequest({
        authorizationRequest,
      });
    }

    throw new Error('Unsupported authorization request');
  }

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
      case 'queryVCs':
        isValidQueryVCsRequest(params, state.currentAccount, state);
        await PolygonService.init();
        res = await this.queryCredentials(params);
        return ResultObject.success(res);
      case 'saveVC':
        isValidSaveVCRequest(params, state.currentAccount, state);
        res = await this.saveCredential(params);
        return ResultObject.success(res);
      case 'createVC':
        isValidCreateVCRequest(params, state.currentAccount, state);
        await VeramoService.importIdentifier();
        res = await this.createCredential(params);
        return ResultObject.success(res);
      case 'createVP':
        isValidCreateVPRequest(params);
        await VeramoService.importIdentifier();
        res = await this.createPresentation(params);
        return ResultObject.success(res);
      case 'deleteVC':
        isValidDeleteVCsRequest(params, state.currentAccount, state);
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
        await GeneralService.togglePopups();
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
      case 'getVCStore':
        res = await GeneralService.getVCStore();
        return ResultObject.success(res);
      case 'setVCStore':
        isValidSetVCStoreRequest(params);
        res = await GeneralService.setVCStore(params);
        return ResultObject.success(res);
      case 'getAvailableVCStores':
        res = await GeneralService.getAvailableVCStores();
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
      default:
        throw new Error('Method not found.');
    }
  }
}

export default SnapService;
