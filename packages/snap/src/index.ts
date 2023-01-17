/* eslint-disable consistent-return*/
import { OnRpcRequestHandler } from '@metamask/snaps-types';
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
  setAccountPublicKey,
} from './utils/stateUtils';
import { getCurrentAccount } from './utils/snapUtils';
import { getAddressKeyDeriver } from './utils/keyPair';
import { ApiParams } from './interfaces';
import { deleteVC } from './rpc/vc/deleteVC';
import { resolveDID } from './rpc/did/resolveDID';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  let state = await getSnapStateUnchecked(snap);

  if (state === null) state = await initSnapState(snap);

  const account = await getCurrentAccount(ethereum);

  // FIXME: HANDLE NULL maybe throw ?
  if (account === null) return;

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

  switch (request.method) {
    case 'queryVCs':
      isValidQueryRequest(request.params, apiParams.account, apiParams.state);
      return await queryVCs(apiParams, request.params);
    case 'saveVC':
      isValidSaveVCRequest(request.params, apiParams.account, apiParams.state);
      return await saveVC(apiParams, request.params);
    case 'createVP':
      isValidCreateVPRequest(
        request.params,
        apiParams.account,
        apiParams.state
      );
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      return await createVP(apiParams, request.params);
    case 'togglePopups':
      return await togglePopups(apiParams);
    case 'switchDIDMethod':
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(apiParams, request.params);
    case 'getDID':
      return await getDid(apiParams);
    case 'getSelectedMethod':
      return state.accountState[account].accountConfig.ssi.didMethod;
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return state.accountState[account].accountConfig.ssi.vcStore;
    case 'setVCStore':
      isValidSetVCStoreRequest(request.params);
      return await setVCStore(apiParams, request.params);
    case 'getAccountSettings':
      return state.accountState[account].accountConfig;
    case 'getSnapSettings':
      return state.snapConfig;
    case 'getAvailableVCStores':
      return getAvailableVCStores();
    case 'deleteVC':
      isValidDeleteVCRequest(
        request.params,
        apiParams.account,
        apiParams.state
      );
      return await deleteVC(apiParams, request.params);
    case 'resolveDID':
      isValidResolveDIDRequest(request.params);
      return await resolveDID(request.params.did);
    default:
      throw new Error('Method not found.');
  }
};
