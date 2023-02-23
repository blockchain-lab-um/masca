import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { Result, ResultObject } from '@blockchain-lab-um/utils';
import { togglePopups } from './rpc/snap/configure';
import { queryVCs } from './rpc/vc/queryVCs';
import { createVP } from './rpc/vc/createVP';
import { saveVC } from './rpc/vc/saveVC';
import {
  isValidCreateVPRequest,
  isValidSaveVCRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
  isValidDeleteVCRequest,
  isValidQueryRequest,
  isValidResolveDIDRequest,
} from './utils/params';
import { switchMethod } from './rpc/did/switchMethod';
import { getDid } from './rpc/did/getDID';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';
import {
  getSnapStateUnchecked,
  initAccountState,
  initSnapState,
} from './utils/stateUtils';
import { getCurrentAccount, setAccountPublicKey } from './utils/snapUtils';
import { getAddressKeyDeriver } from './utils/keyPair';
import { ApiParams } from './interfaces';
import { deleteVC } from './rpc/vc/deleteVC';
import { resolveDID } from './rpc/did/resolveDID';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
}): Promise<Result<unknown>> => {
  try {
    let state = await getSnapStateUnchecked(snap);
    if (state === null) state = await initSnapState(snap);

    const account = await getCurrentAccount(ethereum);

    if (account === null) throw new Error('No account found');

    const apiParams: ApiParams = {
      state,
      snap,
      ethereum,
      account,
    };

    if (!(account in state.accountState)) {
      await initAccountState(apiParams);
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      await setAccountPublicKey(apiParams);
    }
    let res;
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
        res = await switchMethod(apiParams, request.params);
        return ResultObject.success(res);
      case 'getDID':
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
        res = await resolveDID(request.params.did);
        return ResultObject.success(res);
      default:
        throw new Error('Method not found.');
    }
  } catch (e) {
    // TODO (martin): Check for any and unknown errors
    return ResultObject.error(e as Error);
  }
};
