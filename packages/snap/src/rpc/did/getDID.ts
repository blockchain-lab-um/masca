import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const res = await getCurrentDid(params);
  return res;
}
