import './polyfills/intl';

import { isValidSetCurrentAccountRequest } from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

import GeneralService from './General.service';
import SnapService from './Snap.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import VeramoService from './veramo/Veramo.service';
import WalletService from './Wallet.service';

export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}): Promise<Result<any>> => {
  const referrer = new URL(origin);
  try {
    await StorageService.init();

    if (request.method === 'setCurrentAccount') {
      isValidSetCurrentAccountRequest(request.params);
      await GeneralService.setCurrentAccount({
        account: request.params.account.toLowerCase(),
      });
      await StorageService.save();
      return ResultObject.success(true);
    }

    await GeneralService.initAccountState();

    await WalletService.init();

    await VeramoService.init();

    await UIService.init(referrer.hostname);

    const { method, params } = request;

    const response = await SnapService.handleRpcRequest(
      method,
      params,
      referrer.hostname
    );

    await StorageService.save();

    return response;
  } catch (e) {
    console.error(e);
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};
