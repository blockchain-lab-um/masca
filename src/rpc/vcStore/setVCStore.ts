import { snapConfirm } from '../../utils/snapUtils';
import { getAccountConfig, updateAccountConfig } from '../../utils/stateUtils';

export async function setVCStore(): Promise<boolean> {
  const accountConfig = await getAccountConfig();
  if (accountConfig.ssi.vcStore === 'snap') {
    const promptObj = {
      prompt: 'Change vcStore plugin',
      description: 'Would you to start using Ceramic Network?',
      textAreaContent:
        'Every VC from now will be stored on Ceramic Network, until you change this setting. VCs stored on Ceramic Network are synced with other wallets, meaning you will get access to the same VCs on your other wallets with this Account!',
    };
    if (await snapConfirm(promptObj)) {
      accountConfig.ssi.vcStore = 'ceramic';
      await updateAccountConfig(accountConfig);
    }
  } else {
    accountConfig.ssi.vcStore = 'snap';
    await updateAccountConfig(accountConfig);
  }
  console.log('New VCStore: ', accountConfig.ssi.vcStore);
  return true;
}
