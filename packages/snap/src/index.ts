import './polyfills/intl';

import {
  CURRENT_STATE_VERSION,
  isValidSetCurrentAccountRequest,
  QueryCredentialsOptions,
  QueryCredentialsRequestParams,
} from '@blockchain-lab-um/masca-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUpdateHandler,
} from '@metamask/snaps-sdk';

import EthereumService from './Ethereum.service';
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

    await EthereumService.init();

    await UIService.init(origin);

    const { method, params } = request;

    const response = await SnapService.handleRpcRequest(method, params, origin);

    await StorageService.save();

    return response;
  } catch (e) {
    console.error(e);
    // TODO (martin, urban): Check for any and unknown errors
    return ResultObject.error((e as Error).toString());
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  await StorageService.init();
  await GeneralService.initAccountState();
  await WalletService.init();
  await VeramoService.init();
  await EthereumService.init();

  const did = await SnapService.getDID();

  let vcs = [];

  try {
    const state = StorageService.get();
    const session =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.ceramicSession;

    const queryParams = {} as QueryCredentialsRequestParams;

    if (!session) {
      queryParams.options = {
        store: ['snap'],
      } as QueryCredentialsOptions;
    }

    vcs = await SnapService.queryCredentials(queryParams, true);
  } catch (e) {
    console.error(e);
  }
  await UIService.init('');
  return UIService.homePage(did, vcs.length);
};

export const onInstall: OnInstallHandler = async () => {
  await UIService.init('');
  await UIService.install();
};

export const onUpdate: OnUpdateHandler = async () => {
  await UIService.init('');
  await UIService.update();
};
