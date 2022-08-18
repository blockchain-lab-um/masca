import { getCurrentDid } from "../utils/did_utils";

export async function getDid(): Promise<string> {
  return await getCurrentDid();
}
