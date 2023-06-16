import { ApiParams } from '../interfaces';
import { setSession } from '../utils/ceramicUtils';

export async function setCeramicSession(
  params: ApiParams,
  sessionKey: string
): Promise<boolean> {
  const res = await setSession(params.snap, params.state, sessionKey);
  return res;
}
