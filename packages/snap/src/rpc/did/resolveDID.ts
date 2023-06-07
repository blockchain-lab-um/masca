import { ApiParams } from '../../interfaces';
import { resolveDid } from '../../utils/didUtils';

export async function resolveDID(params: ApiParams, did: string) {
  if (did === '') return { message: 'DID is empty' };
  const res = await resolveDid({ ...params, did });
  return res;
}
