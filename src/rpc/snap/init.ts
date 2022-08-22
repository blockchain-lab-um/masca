import { getPublicKey, snapConfirm } from '../../utils/snapUtils';
import { getSnapConfig, updateSnapConfig } from '../../utils/stateUtils';

export async function init(): Promise<void> {
  const globalConifg = await getSnapConfig();
  // Accept terms and conditions
  if (!globalConifg.snap.acceptedTerms) {
    const promptObj = {
      prompt: 'Terms and Conditions',
      description: 'Risks about using SSI Snap',
      textAreaContent:
        'SSI Snap does not access your private keys. You are in control of what VCs and VPs you sign and what you use your DIDs for. To learn more about SSI Snap visit the documentation: https://blockchain-lab-um.github.io/ssi-snap-docs/',
    };
    if (await snapConfirm(promptObj)) {
      console.log('starting init');
      // Get public key for current account
      globalConifg.snap.acceptedTerms = true;
      await updateSnapConfig(globalConifg);
      await getPublicKey();
    }
  } else if (globalConifg.snap.acceptedTerms) {
    await getPublicKey();
  } else throw new Error('User did not accept terms and conditions');
}
