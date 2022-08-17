import { availableMethods } from "../did/did-methods";
import { changeCurrentMethod, getCurrentMethod } from "../utils/did_utils";

export async function switchMethod(
  didMethod: typeof availableMethods[number]
): Promise<boolean> {
  const method = await getCurrentMethod();
  if (didMethod != method) {
    if (method !== didMethod) {
      await changeCurrentMethod(didMethod);
      return true;
    }
  }
  return false;
}
