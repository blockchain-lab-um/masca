import VeramoService from 'src/veramo/Veramo.service';

export async function getDid(): Promise<string> {
  const identifier = await VeramoService.getIdentifier();
  return identifier.did;
}
