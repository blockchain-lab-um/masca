import {
  MetaMaskSSISnap,
  enableSSISnap,
} from '@blockchain-lab-um/ssi-snap-connector';

let isInstalled = false;

export interface SnapInitializationResponse {
  isSnapInstalled: boolean;
  snap?: MetaMaskSSISnap;
}

export async function initiateSSISnap(
  snapId: string
): Promise<SnapInitializationResponse> {
  try {
    console.log('Attempting to connect to snap...');
    const metamaskSSISnap = await enableSSISnap({
      snapId,
      supportedMethods: ['did:ethr', 'did:key'],
    });
    isInstalled = true;
    console.log('Snap installed!');
    return { isSnapInstalled: true, snap: metamaskSSISnap };
  } catch (e) {
    console.error(e);
    isInstalled = false;
    return { isSnapInstalled: false };
  }
}

export function isSSISnapInstalled(): boolean {
  return isInstalled;
}
