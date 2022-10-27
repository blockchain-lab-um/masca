import { MetaMaskSSISnap } from './snap';
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from './utils';
const defaultSnapOrigin = 'npm:@blockchain-lab-um/ssi-snap';

export { MetaMaskSSISnap } from './snap';
export {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from './utils';

const availableMethods = ['did:ethr', 'did:key'] as const;

export type SnapInstallationParams = {
  snapId?: string;
  version?: string;
  supportedMethods?: Array<typeof availableMethods[number]>;
};

/**
 * Install and enable SSI Snap
 *
 * Checks for existence of Metamask and version compatibility with snaps before installation.
 *
 *
 * @param snapInstallationParams - set snapID, version and a list of supported methods
 *
 *
 * @return MetaMaskSSISnap - adapter object that exposes snap API
 */
export async function enableSSISnap(
  snapInstallationParams: SnapInstallationParams = {}
): Promise<MetaMaskSSISnap> {
  const {
    snapId = defaultSnapOrigin,
    version = 'latest',
    supportedMethods = ['did:ethr'],
  } = snapInstallationParams;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed');
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }

  const isInstalled = await isSnapInstalled(snapId);

  if (!isInstalled) {
    await window.ethereum.request({
      method: 'wallet_enable',
      params: [
        {
          [`wallet_snap_${snapId}`]: {
            version: version,
          },
        },
      ],
    });
  }

  // create snap describer
  const snap = new MetaMaskSSISnap(snapId, supportedMethods);

  //initialize snap
  const snapApi = await snap.getSSISnapApi();

  const method = await snapApi.getMethod();
  if (!snap.supportedMethods.includes(method)) {
    console.log('Switching method...', method, snap.supportedMethods[0]);
    await snapApi.switchMethod(snap.supportedMethods[0]);
  }

  // return snap object
  return snap;
}
