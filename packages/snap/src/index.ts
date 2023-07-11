import './polyfills/intl';

import { isValidSetCurrentAccountRequest } from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import { OnRpcRequestHandler } from '@metamask/snaps-types';

import GeneralService from './General.service';
import SnapService from './Snap.service';
import StorageServcice from './storage/Storage.service';
import VeramoService from './veramo/Veramo.service';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}): Promise<Result<unknown>> => {
  try {
    await GeneralService.init();

    if (request.method === 'setCurrentAccount') {
      isValidSetCurrentAccountRequest(request.params);
      await GeneralService.setCurrentAccount(request.params.currentAccount); // FIXME: Rename parameter to account
      await StorageServcice.save();
      return ResultObject.success(true);
    }

    await GeneralService.initAccountState();

    await VeramoService.init();

    const { method, params } = request;

    const response = await SnapService.handleRpcRequest(method, params, origin);

    await StorageServcice.save();

    return response;
  } catch (e) {
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};
