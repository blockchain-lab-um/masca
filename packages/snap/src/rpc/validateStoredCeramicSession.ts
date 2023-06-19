import { ApiParams } from '../interfaces';
import { validateSession } from '../utils/ceramicUtils';

export async function validateStoredCeramicSession(
  params: ApiParams
): Promise<string> {
  const { state } = params;
  const serializedSession = await validateSession(
    state.accountState[state.currentAccount].ceramicSession
  );
  return serializedSession;
}
