import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { snap, ethereum, account, origin } = params;
  const res = await getCurrentDid(params);
  return res;
}
