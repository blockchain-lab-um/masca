import {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
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
import { handleOIDCAuthorizationRequest } from './rpc/oidc/handleOIDCAuthorizationRequest';
import { handleOIDCCredentialOffer } from './rpc/oidc/handleOIDCCredentialOffer';
import { createUnsignedVerifiableCredential } from './rpc/vc/createVC';
import { createUnsignedVerifiablePresentation } from './rpc/vc/createVP';
import { snapConfirm } from './utils/snapUtils';
import { getSnapState } from './utils/stateUtils';
import { veramoCreateVC } from './utils/veramoUtils';
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
      const identifier = await VeramoService.getIdentifier();
      const unsignedVc = await createUnsignedVerifiableCredential({
        vc: minimalUnsignedCredential,
        did: identifier.did,
      });

      return unsignedVc;
    }

    const vc = await veramoCreateVC({
      minimalUnsignedCredential,
      proofFormat,
      options,
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

    if (method === 'did:ethr' || method === 'did:pkh') {
      if (proofFormat !== 'EthereumEip712Signature2021') {
        throw new Error('proofFormat must be EthereumEip712Signature2021');
      }
      const identifier = await VeramoService.getIdentifier();

      const unsignedVp = await createUnsignedVerifiablePresentation({
        vcs: args.vcs,
        did: identifier.did,
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
    return handleOIDCCredentialOffer(args);
  }

  static async handleAuthorizationRequest(args: any): Promise<any> {
    return handleOIDCAuthorizationRequest(args);
  }

  // static async togglePopups(): {};
  // static async switchMethod(): {};
  // static async getSelectedMethod(): {};
  // static async getAvailableMethods(): {};
  // static async setCeramicSession(): {};
  // static async validateStoredCeramicSession(): {};
  // static async getAvailableVCStores(): {};
  // static async setVCStore(): {};

  static async handleRpcRequest(
    method: string,
    params: any,
    origin: string
  ): Promise<Result<any>> {
    this.origin = origin;

    let res;

    switch (method) {
      case 'queryVCs':
        res = await this.queryCredentials(params);
        return ResultObject.success(res);
      case 'saveVC':
        res = await this.saveCredential(params);
        return ResultObject.success(res);
      case 'createVC':
        res = await this.createCredential(params);
        return ResultObject.success(res);
      case 'createVP':
        res = await this.createPresentation(params);
        return ResultObject.success(res);
      case 'deleteVC':
        res = await this.deleteCredential(params);
        return ResultObject.success(res);
      case 'getDID':
        res = await this.getDID();
        return ResultObject.success(res);
      case 'resolveDID':
        res = await this.resolveDID(params);
        return ResultObject.success(res);
      case 'verifyData':
        res = await this.verifyData(params);
        return ResultObject.success(res);
      case 'handleOIDCCredentialOffer':
        res = await this.handleCredentialOffer(params);
        return ResultObject.success(res);
      case 'handleOIDCAuthorizationRequest':
        res = await this.handleAuthorizationRequest(params);
        return ResultObject.success(res);

      // case 'togglePopups':
      //   res = await togglePopups(apiParams);
      //   return ResultObject.success(res);
      // case 'switchDIDMethod':
      //   res = await switchMethod(apiParams, params);
      //   return ResultObject.success(res);
      // case 'getSelectedMethod':
      //   res = getAvailableMethods();
      //   return ResultObject.success(res);
      // case 'getVCStore':
      //   return ResultObject.success(res);
      // case 'setVCStore':
      //   res = await setVCStore(apiParams, params);
      //   return ResultObject.success(res);
      // case 'getAccountSettings':
      //   res = state.accountState[account].accountConfig;
      //   return ResultObject.success(res);
      // case 'getSnapSettings':
      //   res = state.snapConfig;
      //   return ResultObject.success(res);
      // case 'getAvailableVCStores':
      //   res = getAvailableVCStores();
      //   return ResultObject.success(res);
      // case 'setCeramicSession':
      //   // TODO (andy) validate request params
      //   res = await setCeramicSession(
      //     apiParams,
      //     params.serializedSession as string
      //   );
      //   return ResultObject.success(res);
      // case 'validateStoredCeramicSession':
      //   await validateStoredCeramicSession(apiParams);
      //   return ResultObject.success(true);
      default:
        throw new Error('Method not found.');
    }
  }
}

export default SnapService;
