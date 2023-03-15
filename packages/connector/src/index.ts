import {
  AvailableMethods,
  isAvailableMethods,
} from '@blockchain-lab-um/ssi-snap-types';
import { Result, ResultObject, isError } from '@blockchain-lab-um/utils';
import detectEthereumProvider from '@metamask/detect-provider';

import { MetaMaskSSISnap } from './snap';

export { MetaMaskSSISnap } from './snap';
export { isSnapInstalled } from './utils';

export type SnapInstallationParams = {
  snapId?: string;
  version?: string;
  supportedMethods?: Array<AvailableMethods>;
};

const defaultSnapOrigin = 'npm:@blockchain-lab-um/ssi-snap';

/**
 * Install and enable SSI Snap
 *
 * Checks for existence of MetaMask Flask and installs SSI Snap if not installed
 *
 * @param snapInstallationParams - set snapID, version and a list of supported methods
 *
 * @return MetaMaskSSISnap - adapter object that exposes snap API
 */
export async function enableSSISnap(
  snapInstallationParams: SnapInstallationParams = {}
): Promise<Result<MetaMaskSSISnap>> {
  const {
    snapId = defaultSnapOrigin,
    version = '^1.4.0',
    supportedMethods = ['did:ethr'],
  } = snapInstallationParams;

  // This resolves to the value of window.ethereum or null
  const provider = await detectEthereumProvider({ mustBeMetaMask: true });

  if (!provider) {
    return ResultObject.error(new Error('No provider found'));
  }

  // web3_clientVersion returns the installed MetaMask version as a string
  const mmVersion: string = await window.ethereum.request({
    method: 'web3_clientVersion',
  });

  if (!mmVersion.includes('flask')) {
    return ResultObject.error(
      new Error('MetaMask is not supported. Please install MetaMask Flask.')
    );
  }

  // FIXME (martin): I don't think we need this check anymore
  // wallet_requestSnaps handles this and allows the use of semver ranges

  // const isInstalled = await isSnapInstalled(snapId, version);

  // if (isError(isInstalled)) {
  //   return ResultObject.error(isInstalled.error);
  // }

  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { version },
      },
    });

    const snap = new MetaMaskSSISnap(snapId, supportedMethods);

    const snapApi = snap.getSSISnapApi();

    const selectedMethodsResult = await snapApi.getSelectedMethod();

    if (isError(selectedMethodsResult)) {
      return ResultObject.error(selectedMethodsResult.error);
    }

    const method = selectedMethodsResult.data;

    if (!isAvailableMethods(method)) {
      const switchResult = await snapApi.switchDIDMethod(
        snap.supportedMethods[0]
      );

      if (isError(switchResult)) {
        return ResultObject.error(switchResult.error);
      }

      if (!switchResult.data) {
        return ResultObject.error(
          new Error('Could not switch to supported DID method')
        );
      }
    }

    return ResultObject.success(snap);
  } catch (err: unknown) {
    return ResultObject.error(err as Error);
  }
}
