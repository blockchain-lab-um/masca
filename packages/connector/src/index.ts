import {
  availableMethods,
  type AvailableMethods,
} from '@blockchain-lab-um/masca-types';
import { isError, ResultObject, type Result } from '@blockchain-lab-um/utils';

import mascaVersionJson from './masca.json';
import { Masca } from './snap.js';

export { Masca } from './snap.js';
export * from '@blockchain-lab-um/masca-types';
export * from '@blockchain-lab-um/utils';

export interface SnapInstallationParams {
  snapId?: string;
  version?: string;
  supportedMethods?: AvailableMethods[];
}

const defaultSnapOrigin = 'npm:@blockchain-lab-um/masca';

/**
 * Install and enable Masca
 * This is the main entry point for Masca
 *
 * Checks for existence of MetaMask and installs Masca if not installed.
 *
 * Set the Masca version to be installed and select the supported DID methods, as these are the only methods that will be available on the API returned from this function.
 *
 * @param snapInstallationParams - set snapID, version and a list of supported methods
 * @return Masca - adapter object that exposes snap API
 */
export async function enableMasca(
  address: string,
  snapInstallationParams: SnapInstallationParams = {}
): Promise<Result<Masca>> {
  const {
    snapId = defaultSnapOrigin,
    version = mascaVersionJson.mascaVersion,
    supportedMethods = availableMethods as unknown as AvailableMethods[],
  } = snapInstallationParams;
  const snap = new Masca(snapId, supportedMethods);
  const provider = snap.providerStore.getCurrentProvider()?.provider;

  if (!provider) {
    return ResultObject.error('No provider found');
  }
  try {
    // FIXME: currently the wallet_requestSnaps is not in type of EIP-1193 provider since its not standard
    // therefore "as unknown as any" is used to bypass the type check
    await provider.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { version },
      },
    } as unknown as any);

    const api = snap.getMascaApi();

    const setAccountRes = await api.setCurrentAccount({
      account: address,
    });

    if (isError(setAccountRes)) {
      return ResultObject.error(setAccountRes.error);
    }

    const selectedMethodsResult = await api.getSelectedMethod();

    if (isError(selectedMethodsResult)) {
      return ResultObject.error(selectedMethodsResult.error);
    }

    const method = selectedMethodsResult.data as AvailableMethods;

    if (!supportedMethods.includes(method)) {
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
    return ResultObject.error((err as Error).message);
  }
}
