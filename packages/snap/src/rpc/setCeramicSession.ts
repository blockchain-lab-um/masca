import { ApiParams } from '../interfaces';
import { updateSnapState } from '../utils/stateUtils';

export async function setCeramicSession(
  params: ApiParams,
  serializedSession: string
): Promise<boolean> {
  const { state } = params;
  state.accountState[state.currentAccount].ceramicSession = serializedSession;
  await updateSnapState(state);
  return true;
}
