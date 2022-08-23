import { getCurrentVCStore } from '../../utils/didUtils';

export async function getVCStore(): Promise<string> {
  return await getCurrentVCStore(wallet);
}
