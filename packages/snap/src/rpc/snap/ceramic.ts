import { ApiParams } from '../../interfaces';
import { setSession, verifyStoredSession } from '../../utils/ceramicUtils';

export async function setCeramicSessionKey(
  params: ApiParams,
  sessionKey: string
): Promise<boolean> {
  const res = await setSession(params.snap, params.state, sessionKey);
  return res;
}

export async function verifyStoredCeramicSessionKey(
  params: ApiParams
): Promise<string> {
  const sessionKey = verifyStoredSession(params.state);
  return sessionKey;
}
