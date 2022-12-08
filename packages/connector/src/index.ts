import { MetaMaskSSISnap } from './snap';
import { AvailableMethods } from '@blockchain-lab-um/ssi-snap-types';
import { hasMetaMask, isMetamaskSnapsSupported } from './utils';
const defaultSnapOrigin = 'npm:@blockchain-lab-um/ssi-snap';

export { MetaMaskSSISnap } from './snap';
export {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from './utils';

export type SnapInstallationParams = {
  snapId?: string;
  version?: string;
  supportedMethods?: Array<AvailableMethods>;
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

  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: { version: version },
    },
  });

  // create snap describer
  const snap = new MetaMaskSSISnap(snapId, supportedMethods);

  //initialize snap
  const snapApi = await snap.getSSISnapApi();
  console.log('Getting DID method...');
  const method = await snapApi.getMethod();
  if (!snap.supportedMethods.includes(method)) {
    console.log('Switching method...', method, snap.supportedMethods[0]);
    await snapApi.switchMethod({ didMethod: snap.supportedMethods[0] });
  }

  // return snap object
  return snap;
}
