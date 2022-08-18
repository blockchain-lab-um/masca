import { availableMethods } from "../did/did-methods";
import { getDidKeyIdentifier } from "../did/key/key-did-utils";
import { availableDataStores } from "../veramo/plugins/availableDataStores";
import { getCurrentAccount, getCurrentNetwork } from "./snap_utils";
import { getAccountConfig, updateAccountConfig } from "./state_utils";

export async function getCurrentDidStore(): Promise<
  typeof availableDataStores[number]
> {
  const config = await getAccountConfig();
  return config.ssi.didStore;
}

export async function changeCurrentDidStore(
  didStore: typeof availableDataStores[number]
) {
  const config = await getAccountConfig();
  config.ssi.didStore = didStore;
  await updateAccountConfig(config);
  return;
}

export async function getCurrentDid(): Promise<string> {
  const method = await getCurrentMethod();
  console.log("Current method", method);
  if (method === "did:ethr") {
    const chain_id = await getCurrentNetwork();
    const address = await getCurrentAccount();
    return "did:ethr:" + chain_id + ":" + address;
  } else if (method === "did:key") {
    const didUrl = await getDidKeyIdentifier();
    return "did:key:" + didUrl;
  }
  //else if (method === ...) {
  else return "";
}

export async function getCurrentMethod(): Promise<
  typeof availableMethods[number]
> {
  const config = await getAccountConfig();
  return config.ssi.didMethod;
}

export async function changeCurrentMethod(
  didMethod: typeof availableMethods[number]
) {
  const config = await getAccountConfig();
  config.ssi.didMethod = didMethod;
  await updateAccountConfig(config);
  return;
}
