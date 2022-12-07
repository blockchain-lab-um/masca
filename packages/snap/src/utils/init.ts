import { SnapsGlobalObject } from '@metamask/snaps-types';
import { SSISnapState } from '../interfaces';
import { snapConfirm } from './snapUtils';
import { initSnapState } from './stateUtils';

export async function init(snap: SnapsGlobalObject): Promise<SSISnapState> {
  const promptObj = {
    prompt: 'Terms and Conditions',
    description: 'Risks about using SSI Snap',
    textAreaContent:
      'SSI Snap does not access your private keys. You are in control of what VCs and VPs you sign and what you use your DIDs for. To learn more about SSI Snap visit the documentation: https://blockchain-lab-um.github.io/ssi-snap-docs/',
  };

  // Accept terms and conditions
  if (await snapConfirm(snap, promptObj)) {
    return await initSnapState(snap);
  } else {
    throw new Error('User did not accept terms and conditions!');
  }
}
