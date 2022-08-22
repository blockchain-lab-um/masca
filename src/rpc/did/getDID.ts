import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(): Promise<string> {
  return await getCurrentDid();
}
