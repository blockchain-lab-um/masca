import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { state, wallet, account, bip44Node } = params;
  return await getCurrentDid(wallet, state, account);
}
