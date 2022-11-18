import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { state, snap, account } = params;
  return await getCurrentDid(snap, state, account);
}
