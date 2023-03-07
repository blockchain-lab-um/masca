import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { ApiParams } from './interfaces';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { getDid } from './rpc/did/getDID';
import { resolveDID } from './rpc/did/resolveDID';
import { switchMethod } from './rpc/did/switchMethod';
import { togglePopups } from './rpc/snap/configure';
import { createVP } from './rpc/vc/createVP';
import { deleteVC } from './rpc/vc/deleteVC';
import { queryVCs } from './rpc/vc/queryVCs';
import { saveVC } from './rpc/vc/saveVC';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAddressKeyDeriver } from './utils/keyPair';
import {
  isValidCreateVPRequest,
  isValidDeleteVCRequest,
  isValidQueryRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
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
}) => {
  let state = await getSnapStateUnchecked(snap);
  if (state === null) state = await initSnapState(snap);

  const account = await getCurrentAccount(ethereum);

  if (account === null) throw new Error('No account found');

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
  let res;
  switch (request.method) {
    case 'queryVCs':
      isValidQueryRequest(request.params, apiParams.account, apiParams.state);
      res = await queryVCs(apiParams, request.params);
      return res;
    case 'saveVC':
      isValidSaveVCRequest(request.params, apiParams.account, apiParams.state);
      res = await saveVC(apiParams, request.params);
      return res;
    case 'createVP':
      isValidCreateVPRequest(
        request.params,
        apiParams.account,
        apiParams.state
      );
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      res = await createVP(apiParams, request.params);
      return res;
    case 'togglePopups':
      res = await togglePopups(apiParams);
      return res;
    case 'switchDIDMethod':
      isValidSwitchMethodRequest(request.params);
      res = await switchMethod(apiParams, request.params);
      return res;
    case 'getDID':
      res = await getDid(apiParams);
      return res;
    case 'getSelectedMethod':
      return state.accountState[account].accountConfig.ssi.didMethod;
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return state.accountState[account].accountConfig.ssi.vcStore;
    case 'setVCStore':
      isValidSetVCStoreRequest(request.params);
      res = await setVCStore(apiParams, request.params);
      return res;
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
      res = await deleteVC(apiParams, request.params);
      return res;
    case 'resolveDID':
      isValidResolveDIDRequest(request.params);
      res = await resolveDID(request.params.did);
      return res;
    default:
      throw new Error('Method not found.');
  }
};
