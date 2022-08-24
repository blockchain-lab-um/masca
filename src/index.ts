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
import { getMethod } from './rpc/did/getMethod';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { getVCStore } from './rpc/vcStore/getVCStore';
import { setVCStore } from './rpc/vcStore/setVCStore';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('Request:', request);
  console.log('Origin:', origin);
  console.log('-------------------------------------------------------------');
  switch (request.method) {
    case 'getVCs':
      isValidGetVCsRequest(request.params);
      return await getVCs(wallet, request.params.query);
    case 'saveVC':
      isValidSaveVCRequest(request.params);
      return await saveVC(wallet, request.params.verifiableCredential);
    case 'getVP':
      isValidGetVPRequest(request.params);
      return await getVP(
        wallet,
        request.params.vcId,
        request.params.domain,
        request.params.challenge
      );
    case 'changeInfuraToken':
      isValidChangeInfuraTokenRequest(request.params);
      return await changeInfuraToken(wallet, request.params.infuraToken);
    case 'togglePopups':
      return await togglePopups(wallet);
    case 'switchMethod':
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(wallet, request.params.didMethod);
    case 'init':
      await init(wallet);
      return true;
    case 'getDID':
      return await getDid(wallet);
    case 'getMethod':
      return await getMethod(wallet);
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return await getVCStore(wallet);
    case 'setVCStore':
      return await setVCStore(wallet);
    case 'getAvailableVCStores':
      return getAvailableVCStores();
    default:
      throw new Error('Method not found.');
  }
};
