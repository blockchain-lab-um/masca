import { isValidSetCurrentAccountRequest } from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import { OnRpcRequestHandler } from '@metamask/snaps-types';

import GeneralService from './General.service';
import SnapService from './Snap.service';
import VeramoService from './veramo/Veramo.service';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}): Promise<Result<unknown>> => {
  try {
    await GeneralService.initState();

    if (request.method === 'setCurrentAccount') {
      isValidSetCurrentAccountRequest(request.params);
      await GeneralService.setCurrentAccount(request.params.currentAccount); // FIXME: Rename parameter to account
      return ResultObject.success(true);
    }

    await GeneralService.initAccountState();

    await VeramoService.init();

    const { method, params } = request;

    return await SnapService.handleRpcRequest(method, params, origin);
  } catch (e) {
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};
