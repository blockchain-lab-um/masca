import VeramoService from '../../veramo/Veramo.service';

export async function resolveDID(did: string) {
  if (did === '') return { message: 'DID is empty' };
  const res = await VeramoService.resolveDID(did);
  return res;
}
