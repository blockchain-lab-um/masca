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
import { clear } from './veramo/plugins/ceramicDataStore/ceramicDataStore';
import { getAvailableVCStores } from './rpc/vcStore/getAvailableVCStores';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('Request:', request);
  console.log('Origin:', origin);
  console.log('-------------------------------------------------------------');
  switch (request.method) {
    case 'helloWorld':
      console.log('Hello World!!!');
      await clear();

      return true;
    case 'getVCs':
      isValidGetVCsRequest(request.params);
      return await getVCs(request.params.query);
    case 'saveVC':
      isValidSaveVCRequest(request.params);
      return await saveVC(request.params.verifiableCredential);
    case 'getVP':
      isValidGetVPRequest(request.params);
      return await getVP(
        request.params.vc_id,
        request.params.domain,
        request.params.challenge
      );
    case 'changeInfuraToken':
      isValidChangeInfuraTokenRequest(request.params);
      return await changeInfuraToken(request.params.infuraToken);
    case 'togglePopups':
      return await togglePopups();
    case 'switchMethod':
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(request.params.didMethod);
    case 'init':
      await init();
      return true;
    case 'getDID':
      return await getDid();
    case 'getMethod':
      return await getMethod();
    case 'getAvailableMethods':
      return getAvailableMethods();
    case 'getVCStore':
      return await getVCStore();
    case 'setVCStore':
      return await setVCStore();
    case 'getAvailableVCStores':
      return getAvailableVCStores();
    default:
      throw new Error('Method not found.');
  }
};
//);
