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
    let accounts = (await wallet.request({
      method: "eth_requestAccounts",
    })) as Array<string>;
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
export async function changeInfuraToken(token: string) {
  let config = await getConfig();
  config.infuraToken = token;
  await updateConfig(config);
  return;
}
