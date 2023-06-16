import { ApiParams } from '../interfaces';
import { validateStoredSession } from '../utils/ceramicUtils';

export async function validateStoredCeramicSession(
  params: ApiParams
): Promise<string> {
  const sessionKey = validateStoredSession(params.state);
  return sessionKey;
}
