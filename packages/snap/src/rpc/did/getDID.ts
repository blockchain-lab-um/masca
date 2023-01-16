import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { state, ethereum, account } = params;
  return await getCurrentDid(ethereum, state, account);
}
