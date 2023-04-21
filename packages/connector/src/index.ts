import {
  AvailableMethods,
  isAvailableMethods,
} from '@blockchain-lab-um/masca-types';
import { Result, ResultObject, isError } from '@blockchain-lab-um/utils';
import detectEthereumProvider from '@metamask/detect-provider';

import { Masca } from './snap.js';

export { Masca } from './snap.js';

export type SnapInstallationParams = {
  snapId?: string;
  version?: string;
  supportedMethods?: Array<AvailableMethods>;
};

const defaultSnapOrigin = 'npm:@blockchain-lab-um/masca';

/**
 * Install and enable Masca
 *
 * Checks for existence of MetaMask Flask and installs Masca if not installed
 *
 * @param snapInstallationParams - set snapID, version and a list of supported methods
 *
 * @return Masca - adapter object that exposes snap API
 */
export async function enableMasca(
  snapInstallationParams: SnapInstallationParams = {}
): Promise<Result<Masca>> {
  const {
    snapId = defaultSnapOrigin,
    version = '^1.5.0',
    supportedMethods = ['did:ethr'],
  } = snapInstallationParams;

  // This resolves to the value of window.ethereum or null
  const provider = await detectEthereumProvider({ mustBeMetaMask: true });

  if (!provider) {
    return ResultObject.error('No provider found');
  }

  // web3_clientVersion returns the installed MetaMask version as a string
  const mmVersion: string = await window.ethereum.request({
    method: 'web3_clientVersion',
  });

  if (!mmVersion.includes('flask')) {
    return ResultObject.error(
      'MetaMask is not supported. Please install MetaMask Flask.'
    );
  }

  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { version },
      },
    });

    const snap = new Masca(snapId, supportedMethods);

    const api = snap.getMascaApi();

    const selectedMethodsResult = await api.getSelectedMethod();

    if (isError(selectedMethodsResult)) {
      return ResultObject.error(selectedMethodsResult.error);
    }

    const method = selectedMethodsResult.data;

    if (!isAvailableMethods(method)) {
      const switchResult = await api.switchDIDMethod(snap.supportedMethods[0]);

      if (isError(switchResult)) {
        return ResultObject.error(switchResult.error);
      }

      if (!switchResult.data) {
        return ResultObject.error('Could not switch to supported DID method');
      }
    }

    return ResultObject.success(snap);
  } catch (err: unknown) {
    return ResultObject.error((err as Error).toString());
  }
}
