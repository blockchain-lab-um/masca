import { getAccountConfig } from '../utils/stateUtils';

export async function getVCStore(): Promise<string> {
  const accountConfig = await getAccountConfig();

  return accountConfig.ssi.vcStore as string;
}
