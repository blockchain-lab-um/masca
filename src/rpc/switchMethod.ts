import { availableMethods } from "../did/did-methods";
import { changeCurrentMethod, getCurrentMethod } from "../utils/did_utils";

export async function switchMethod(didMethod: string): Promise<boolean> {
  const method = await getCurrentMethod();
  if (!availableMethods.find((k) => k === didMethod)) {
    throw new Error("did method not supported");
  }
  if (didMethod != method) {
    if (method !== didMethod) {
      await changeCurrentMethod(didMethod as typeof availableMethods[number]);
      return true;
    }
  }
  return false;
}
