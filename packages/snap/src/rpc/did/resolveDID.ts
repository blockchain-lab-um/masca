import { resolveDid } from '../../utils/didUtils';

export async function resolveDID(did: string) {
  if (did === '') return { message: 'DID is empty' };
  return await resolveDid(did);
}
