import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { state, ethereum, account } = params;
  const res = await getCurrentDid(ethereum, state, account);
  return res;
}
