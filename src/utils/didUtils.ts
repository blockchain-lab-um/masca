import { SnapProvider } from '@metamask/snap-types';
import { availableMethods } from '../did/didMethods';
import { getDidKeyIdentifier } from '../did/key/keyDidUtils';
import { availableDataStores } from '../veramo/plugins/availableDataStores';
import { getCurrentAccount, getCurrentNetwork } from './snapUtils';
import { getAccountConfig, updateAccountConfig } from './stateUtils';

export async function getCurrentDidStore(
  wallet: SnapProvider
): Promise<typeof availableDataStores[number]> {
  const config = await getAccountConfig(wallet);
  return config.ssi.didStore;
}

export async function changeCurrentDidStore(
  wallet: SnapProvider,
  didStore: typeof availableDataStores[number]
) {
  const config = await getAccountConfig(wallet);
  config.ssi.didStore = didStore;
  await updateAccountConfig(wallet, config);
  return;
}

export async function getCurrentDid(wallet: SnapProvider): Promise<string> {
  const method = await getCurrentMethod(wallet);
  console.log('Current method', method);
  if (method === 'did:ethr') {
    const chain_id = await getCurrentNetwork(wallet);
    const address = await getCurrentAccount(wallet);
    return 'did:ethr:' + chain_id + ':' + address;
  } else if (method === 'did:key') {
    const didUrl = await getDidKeyIdentifier(wallet);
    return 'did:key:' + didUrl;
  } else return '';
}

export async function getCurrentMethod(
  wallet: SnapProvider
): Promise<typeof availableMethods[number]> {
  const config = await getAccountConfig(wallet);
  return config.ssi.didMethod;
}

export async function changeCurrentMethod(
  wallet: SnapProvider,
  didMethod: typeof availableMethods[number]
) {
  const config = await getAccountConfig(wallet);
  config.ssi.didMethod = didMethod;
  await updateAccountConfig(wallet, config);
  return;
}
