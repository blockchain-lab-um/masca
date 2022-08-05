import { getConfig, updateConfig } from "./state_utils";
declare let wallet: any;

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns {Promise<string>} address - MetaMask address
 *
 * @beta
 *
 **/
export async function getCurrentAccount(): Promise<string> {
  try {
    const accounts = (await wallet.request({
      method: "eth_requestAccounts",
    })) as Array<string>;
    console.log("MetaMask accounts", accounts);
    const account = accounts[0];
    return account;
  } catch (e) {
    console.log(e);
    return "0x0";
  }
}

/**
 * Function that replaces default Infura Token with @param token.
 *
 * @param token infura token
 */
export async function _changeInfuraToken(token: string) {
  const config = await getConfig();
  config.veramo.infuraToken = token;
  await updateConfig(config);
  return;
}
/**
 * Function that toggles the disablePopups flag in the config.
 *
 */
export async function _togglePopups() {
  const config = await getConfig();
  config.dApp.disablePopups = !config.dApp.disablePopups;
  await updateConfig(config);
  return;
}
/**
 * Function that lets you add a friendly dApp
 */
export async function _addFriendlyDapp(dapp: string) {
  const config = await getConfig();
  config.dApp.friendlyDapps.push(dapp);
  await updateConfig(config);
  return;
}
/**
 * Function that removes a friendly dApp.
 *
 */
export async function _removeFriendlyDapp(dapp: string) {
  const config = await getConfig();
  config.dApp.friendlyDapps = config.dApp.friendlyDapps.filter(
    (d) => d !== dapp
  );
  await updateConfig(config);
  return;
}
/**
 * Function that returns a list of friendly dApps.
 *
 */
export async function _getFriendlyDapps(): Promise<Array<string>> {
  const config = await getConfig();
  return config.dApp.friendlyDapps;
}
