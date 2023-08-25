import './polyfills/intl';

import { isValidSetCurrentAccountRequest } from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import { OnRpcRequestHandler } from '@metamask/snaps-types';

import GeneralService from './General.service';
import SnapService from './Snap.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import VeramoService from './veramo/Veramo.service';
import WalletService from './Wallet.service';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}): Promise<Result<unknown>> => {
  try {
    await StorageService.init();

    if (request.method === 'setCurrentAccount') {
      isValidSetCurrentAccountRequest(request.params);
      await GeneralService.setCurrentAccount({
        account: request.params.currentAccount,
      });
      await StorageService.save();
      return ResultObject.success(true);
    }

    await GeneralService.initAccountState();

    await WalletService.init();

    await VeramoService.init();

    await UIService.init(origin);

    const { method, params } = request;

    const response = await SnapService.handleRpcRequest(method, params, origin);

    await StorageService.save();

    return response;
  } catch (e) {
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};
