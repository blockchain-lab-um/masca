import {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
  isValidCreateVCRequest,
  isValidCreateVPRequest,
  isValidDeleteVCsRequest,
  isValidQueryVCsRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
  isValidVerifyDataRequest,
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
} from '@veramo/core';
import { VerifiablePresentation } from 'did-jwt-vc';

import GeneralService from './General.service';
import { snapConfirm } from './utils/snapUtils';
import { getSnapState } from './utils/stateUtils';
import VeramoService from './veramo/Veramo.service';

class SnapService {
  private static origin: string;

  static async queryCredentials(
    args: QueryVCsRequestParams
  ): Promise<QueryVCsRequestResult[]> {
    const { filter, options } = args ?? {};
    const { store, returnStore = true } = options ?? {};

    const vcs = await VeramoService.queryCredentials({
      options: { store, returnStore },
      filter,
    });

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
      const res = await VeramoService.saveCredential({
        verifiableCredential,
        store,
      });
      return res;
    }

    throw new Error('User rejected the request.');
  }

  static async createCredential(
    args: CreateVCRequestParams
  ): Promise<UnsignedCredential | VerifiableCredential> {
    const { minimalUnsignedCredential, proofFormat, options } = args;
    const { store = 'snap' } = options ?? {};
    const { save } = options ?? {};
    const state = await getSnapState();

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

    const vcs = await VeramoService.queryCredentials({
      options: { store },
      filter: { type: 'id', filter: id },
    });

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
      const res = await VeramoService.deleteCredential({
        id,
        store,
      });
      return res;
    }

    throw new Error('User rejected the request.');
  }

  static async createPresentation(
    args: CreateVPRequestParams
  ): Promise<UnsignedPresentation | VerifiablePresentation> {
    const { vcs, proofFormat = 'jwt', proofOptions } = args;
    const state = await getSnapState();
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
    const identifier = await VeramoService.getIdentifier();
    return identifier.did;
  }

  static async resolveDID(args: { did: string }): Promise<DIDResolutionResult> {
    if (args.did === '') throw new Error('DID cannot be empty');
    const res = await VeramoService.resolveDID(args.did);
    return res;
  }

  static async handleCredentialOffer(args: any): Promise<any> {
    return VeramoService.handleOIDCCredentialOffer(args);
  }

  static async handleAuthorizationRequest(args: any): Promise<any> {
    return VeramoService.handleOIDCAuthorizationRequest(args);
  }

  static async handleRpcRequest(
    method: string,
    params: any,
    origin: string
  ): Promise<Result<any>> {
    this.origin = origin;

    let res;

    const state = await getSnapState();

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
        res = await this.queryCredentials(params);
        return ResultObject.success(res);
      case 'saveVC':
        isValidSaveVCRequest(params, state.currentAccount, state);
        res = await this.saveCredential(params);
        return ResultObject.success(res);
      case 'createVC':
        isValidCreateVCRequest(params, state.currentAccount, state);
        res = await this.createCredential(params);
        return ResultObject.success(res);
      case 'createVP':
        isValidCreateVPRequest(params);
        res = await this.createPresentation(params);
        return ResultObject.success(res);
      case 'deleteVC':
        isValidDeleteVCsRequest(params, state.currentAccount, state);
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
      case 'handleOIDCAuthorizationRequest':
        res = await this.handleAuthorizationRequest(params);
        return ResultObject.success(res);

      /**
       * General.service
       */
      case 'togglePopups':
        await GeneralService.togglePopups();
        return ResultObject.success(true);
      case 'switchDIDMethod':
        isValidSwitchMethodRequest(params);
        await GeneralService.switchDIDMethod(params);
        await VeramoService.init();
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
