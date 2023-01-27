import { resolveDid } from '../../utils/didUtils';

export async function resolveDID(did: string) {
  if (did === '') return { message: 'DID is empty' };
  const res = await resolveDid(did);
  return res;
}
