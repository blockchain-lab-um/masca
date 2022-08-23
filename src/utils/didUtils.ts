import { availableMethods } from '../did/didMethods';
import { getDidKeyIdentifier } from '../did/key/keyDidUtils';
import { availableVCStores } from '../veramo/plugins/availableVCStores';
import { getCurrentAccount, getCurrentNetwork } from './snapUtils';
import { getAccountConfig, updateAccountConfig } from './stateUtils';

export async function getCurrentVCStore(): Promise<
  typeof availableVCStores[number]
> {
  const config = await getAccountConfig();
  return config.ssi.vcStore;
}

export async function changeCurrentVCStore(
  didStore: typeof availableVCStores[number]
) {
  const config = await getAccountConfig();
  config.ssi.vcStore = didStore;
  await updateAccountConfig(config);
  return;
}

export async function getCurrentDid(): Promise<string> {
  const method = await getCurrentMethod();
  console.log('Current method', method);
  if (method === 'did:ethr') {
    const chain_id = await getCurrentNetwork();
    const address = await getCurrentAccount();
    return 'did:ethr:' + chain_id + ':' + address;
  } else if (method === 'did:key') {
    const didUrl = await getDidKeyIdentifier();
    return 'did:key:' + didUrl;
  }
  //else if (method === ...) {
  else return '';
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
