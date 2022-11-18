/* eslint-disable consistent-return*/
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { togglePopups, changeInfuraToken } from './rpc/snap/configure';
import { getVCs } from './rpc/vc/getVCs';
import { getVP } from './rpc/vc/getVP';
import { saveVC } from './rpc/vc/saveVC';
import {
  isValidChangeInfuraTokenRequest,
  isValidGetVCsRequest,
  isValidGetVPRequest,
  isValidSaveVCRequest,
  isValidSwitchMethodRequest,
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

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state = await getSnapStateUnchecked(snap);
  if (state === null) state = await init(snap);

  const account = await getCurrentAccount(snap);

  // FIXME: HANDLE NULL maybe throw ?
  if (account === null) return;

  const apiParams: ApiParams = {
    state,
    snap,
    account,
  };

  if (!(account in state.accountState)) {
    await initAccountState(apiParams);
    apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
    await setAccountPublicKey(apiParams);
  }

  console.log('Request:', request);
  console.log('Origin:', origin);
  console.log('-------------------------------------------------------------');

  switch (request.method) {
    case 'getVCs':
      isValidGetVCsRequest(request.params);
      return await getVCs(apiParams, request.params.query);
    case 'saveVC':
      isValidSaveVCRequest(request.params);
      return await saveVC(apiParams, request.params.verifiableCredential);
    case 'getVP':
      isValidGetVPRequest(request.params);
      apiParams.bip44CoinTypeNode = await getAddressKeyDeriver(apiParams);
      return await getVP(
        apiParams,
        request.params.vcId,
        request.params.domain,
        request.params.challenge
      );
    case 'changeInfuraToken':
      isValidChangeInfuraTokenRequest(request.params);
      return await changeInfuraToken(apiParams, request.params.infuraToken);
    case 'togglePopups':
      return await togglePopups(apiParams);
    case 'switchMethod':
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(apiParams, request.params.didMethod);
    case 'getDID':
      return await getDid(apiParams);
    case 'getMethod':
      return state.accountState[account].accountConfig.ssi.didMethod;
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return state.accountState[account].accountConfig.ssi.vcStore;
    // TODO: RENAME THIS OR CHANGE PARAMETERS -> Current behaviour is switch not set
    case 'setVCStore':
      return await setVCStore(apiParams);
    case 'getAvailableVCStores':
      return getAvailableVCStores();
    default:
      throw new Error('Method not found.');
  }
};
