import type {
  HandleOIDCAuthorizationRequestParams,
  HandleOIDCCredentialOfferRequestParams,
  SendOIDCAuthorizationResponseParams,
} from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { ApiParams } from './interfaces';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { getDid } from './rpc/did/getDID';
import { resolveDID } from './rpc/did/resolveDID';
import { switchMethod } from './rpc/did/switchMethod';
import { handleOIDCAuthorizationRequest } from './rpc/oidc/handleOIDCAuthorizationRequest';
import { handleOIDCCredentialOffer } from './rpc/oidc/handleOIDCCredentialOffer';
import { sendOIDCAuthorizationResponse } from './rpc/oidc/sendOIDCAuthorizationResponse';
import { setCeramicSession } from './rpc/setCeramicSession';
import { togglePopups } from './rpc/snap/configure';
import { setCurrentAccount } from './rpc/snap/setCurrentAccount';
import { validateStoredCeramicSession } from './rpc/validateStoredCeramicSession';
import { createVC } from './rpc/vc/createVC';
import { createVP } from './rpc/vc/createVP';
import { deleteVC } from './rpc/vc/deleteVC';
import { queryVCs } from './rpc/vc/queryVCs';
import { saveVC } from './rpc/vc/saveVC';
import { verifyData } from './rpc/vc/verifyData';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAddressKeyDeriver } from './utils/keyPair';
import {
  isValidCreateVCRequest,
  isValidCreateVPRequest,
  isValidDeleteVCRequest,
  isValidQueryRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSetCurrentAccountRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
  isValidVerifyDataRequest,
} from './utils/params';
import { getCurrentAccount, setAccountPublicKey } from './utils/snapUtils';
import {
  getSnapStateUnchecked,
  initAccountState,
  initSnapState,
} from './utils/stateUtils';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}): Promise<Result<unknown>> => {
  try {
    let state = await getSnapStateUnchecked(snap);
    if (state === null) state = await initSnapState(snap);

    let res;

    if (request.method === 'setCurrentAccount') {
      isValidSetCurrentAccountRequest(request.params);
      res = await setCurrentAccount(
        {
          state,
          snap,
          ethereum,
          account: '',
          origin,
        },
        request.params
      );
      return ResultObject.success(res);
    }

    const account = getCurrentAccount(state);

    const apiParams: ApiParams = {
      state,
      snap,
      ethereum,
      account,
      origin,
    };

    if (!(account in state.accountState)) {
      await initAccountState(apiParams);
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      await setAccountPublicKey(apiParams);
    }
    switch (request.method) {
      case 'queryVCs':
        isValidQueryRequest(request.params, apiParams.account, apiParams.state);
        res = await queryVCs(apiParams, request.params);
        return ResultObject.success(res);
      case 'saveVC':
        isValidSaveVCRequest(
          request.params,
          apiParams.account,
          apiParams.state
        );
        res = await saveVC(apiParams, request.params);
        return ResultObject.success(res);
      case 'createVC':
        isValidCreateVCRequest(
          request.params,
          apiParams.account,
          apiParams.state
        );
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await createVC(apiParams, request.params);
        return ResultObject.success(res);
      case 'createVP':
        isValidCreateVPRequest(
          request.params,
          apiParams.account,
          apiParams.state
        );
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await createVP(apiParams, request.params);
        return ResultObject.success(res);
      case 'togglePopups':
        res = await togglePopups(apiParams);
        return ResultObject.success(res);
      case 'switchDIDMethod':
        isValidSwitchMethodRequest(request.params);
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await switchMethod(apiParams, request.params);
        return ResultObject.success(res);
      case 'getDID':
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await getDid(apiParams);
        return ResultObject.success(res);
      case 'getSelectedMethod':
        res = state.accountState[account].accountConfig.ssi.didMethod;
        return ResultObject.success(res);
      case 'getAvailableMethods':
        res = getAvailableMethods();
        return ResultObject.success(res);
      case 'getVCStore':
        res = state.accountState[account].accountConfig.ssi.vcStore;
        return ResultObject.success(res);
      case 'setVCStore':
        isValidSetVCStoreRequest(request.params);
        res = await setVCStore(apiParams, request.params);
        return ResultObject.success(res);
      case 'getAccountSettings':
        res = state.accountState[account].accountConfig;
        return ResultObject.success(res);
      case 'getSnapSettings':
        res = state.snapConfig;
        return ResultObject.success(res);
      case 'getAvailableVCStores':
        res = getAvailableVCStores();
        return ResultObject.success(res);
      case 'deleteVC':
        isValidDeleteVCRequest(
          request.params,
          apiParams.account,
          apiParams.state
        );
        res = await deleteVC(apiParams, request.params);
        return ResultObject.success(res);
      case 'resolveDID':
        isValidResolveDIDRequest(request.params);
        res = await resolveDID(apiParams, request.params.did);
        return ResultObject.success(res);
      case 'verifyData':
        isValidVerifyDataRequest(request.params);
        res = await verifyData(apiParams, request.params);
        return ResultObject.success(res);
      case 'handleOIDCCredentialOffer':
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await handleOIDCCredentialOffer(
          apiParams,
          request.params as unknown as HandleOIDCCredentialOfferRequestParams
        );
        return ResultObject.success(res);
      case 'handleOIDCAuthorizationRequest':
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await handleOIDCAuthorizationRequest(
          apiParams,
          request.params as unknown as HandleOIDCAuthorizationRequestParams
        );
        return ResultObject.success(res);
      case 'sendOIDCAuthorizationResponse':
        apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
        res = await sendOIDCAuthorizationResponse(
          apiParams,
          request.params as unknown as SendOIDCAuthorizationResponseParams
        );
        return ResultObject.success(res);
      case 'setCeramicSession':
        // TODO (andy) validate request params
        res = await setCeramicSession(
          apiParams,
          (request.params as any).sessionKey as string
        );
        return ResultObject.success(res);
      case 'validateStoredCeramicSession':
        await validateStoredCeramicSession(apiParams);
        return ResultObject.success(true);
      default:
        throw new Error('Method not found.');
    }
  } catch (e) {
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};
