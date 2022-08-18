import { getCurrentMethod } from "../utils/did_utils";

export async function getMethod(): Promise<string> {
  return await getCurrentMethod();
}
