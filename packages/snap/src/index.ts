/* eslint-disable consistent-return*/
import { OnRpcRequestHandler } from '@metamask/snap-types';
import { togglePopups, changeInfuraToken } from './rpc/snap/configure';
import { queryVCs } from './rpc/vc/queryVCs';
import { createVP } from './rpc/vc/createVP';
import { saveVC } from './rpc/vc/saveVC';
import {
  isValidChangeInfuraTokenRequest,
  isValidCreateVPRequest,
  isValidSaveVCRequest,
  isValidSetVCStoreRequest,
  isValidSwitchMethodRequest,
  isValidDeleteVCRequest,
  isValidQueryRequest,
} from './utils/params';
import { switchMethod } from './rpc/did/switchMethod';
import { init } from './utils/init';
import { getDid } from './rpc/did/getDID';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';
import {
  getSnapStateUnchecked,
  initAccountState,
  setAccountPublicKey,
} from './utils/stateUtils';
import { getCurrentAccount } from './utils/snapUtils';
import { getAddressKeyDeriver } from './utils/keyPair';
import { ApiParams } from './interfaces';
import { deleteVC } from './rpc/vc/deleteVC';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  let state = await getSnapStateUnchecked(wallet);
  if (state === null) state = await init(wallet);

  const account = await getCurrentAccount(wallet);

  // FIXME: HANDLE NULL maybe throw ?
  if (account === null) return;

  const apiParams: ApiParams = {
    state,
    wallet,
    account,
  };

  if (!(account in state.accountState)) {
    await initAccountState(apiParams);
    apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
    await setAccountPublicKey(apiParams);
  }

  switch (request.method) {
    case 'queryVCs':
      isValidQueryRequest(request.params);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await queryVCs(apiParams, request.params);
    case 'saveVC':
      isValidSaveVCRequest(request.params);
      return await saveVC(apiParams, request.params);
    case 'createVP':
      isValidCreateVPRequest(request.params);
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      return await createVP(apiParams, request.params);
    case 'changeInfuraToken':
      isValidChangeInfuraTokenRequest(request.params);
      return await changeInfuraToken(apiParams, request.params);
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
      isValidDeleteVCRequest(request.params);
      return await deleteVC(apiParams, request.params);
    default:
      throw new Error('Method not found.');
  }
};
