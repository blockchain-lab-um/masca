import { OnRpcRequestHandler } from '@metamask/snap-types';
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
import { init } from './rpc/snap/init';
import { getDid } from './rpc/did/getDID';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';
import { getSnapStateUnchecked, initAccountState } from './utils/stateUtils';
import { getCurrentAccount } from './utils/snapUtils';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state = await getSnapStateUnchecked(wallet);
  if (state === null) state = await init(wallet);

  const account = await getCurrentAccount(wallet);

  // FIXME: HANDLE NULL maybe throw ?
  if (account === null) return;

  if (!(account in state.accountState)) {
    await initAccountState(wallet, state, account);
  }

  console.log('Request:', request);
  console.log('Origin:', origin);
  console.log('-------------------------------------------------------------');
  switch (request.method) {
    case 'getVCs':
      isValidGetVCsRequest(request.params);
      return await getVCs(wallet, state, account, request.params.query);
    case 'saveVC':
      isValidSaveVCRequest(request.params);
      return await saveVC(
        wallet,
        state,
        account,
        request.params.verifiableCredential
      );
    case 'getVP':
      isValidGetVPRequest(request.params);
      return await getVP(
        wallet,
        state,
        account,
        request.params.vcId,
        request.params.domain,
        request.params.challenge
      );
    case 'changeInfuraToken':
      isValidChangeInfuraTokenRequest(request.params);
      return await changeInfuraToken(wallet, state, request.params.infuraToken);
    case 'togglePopups':
      return await togglePopups(wallet);
    case 'switchMethod':
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(
        wallet,
        state,
        account,
        request.params.didMethod
      );
    case 'getDID':
      return await getDid(wallet, state, account);
    case 'getMethod':
      return state.accountState[account].accountConfig.ssi.didMethod;
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return state.accountState[account].accountConfig.ssi.vcStore;
    // TODO: RENAME THIS
    case 'setVCStore':
      return await setVCStore(wallet, state, account);
    case 'getAvailableVCStores':
      return getAvailableVCStores();
    default:
      throw new Error('Method not found.');
  }
};
