import { getAccountConfig, updateAccountConfig } from '../utils/stateUtils';

export async function setVCStore(): Promise<boolean> {
  const accountConfig = await getAccountConfig();
  if (accountConfig.ssi.vcStore === 'snap') {
    accountConfig.ssi.vcStore = 'ceramic';
    await updateAccountConfig(accountConfig);
  } else {
    accountConfig.ssi.vcStore = 'snap';
    await updateAccountConfig(accountConfig);
  }
  console.log('New VCStore: ', accountConfig.ssi.vcStore);
  return true;
}
