import { SnapsGlobalObject } from '@metamask/snaps-types';

import { MascaState } from '../interfaces';
import { initSnapState } from './stateUtils';

export async function init(snap: SnapsGlobalObject): Promise<MascaState> {
  const promptObj = {
    prompt: 'Terms and Conditions',
    description: 'Risks about using Masca',
    textAreaContent:
      'Masca does not access your private keys. You are in control of what VCs and VPs you sign and what you use your DIDs for. To learn more about Masca visit the documentation: https://blockchain-lab-um.github.io/masca-docs/',
  };

  // Accept terms and conditions
  // if (snapConfirm(snap, promptObj)) {
  return initSnapState(snap);
  // } else {
  // throw new Error('User did not accept terms and conditions!');
  // }
}
