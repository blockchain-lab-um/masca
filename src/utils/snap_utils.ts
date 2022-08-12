/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  getConfig,
  updateConfig,
  getVCAccount,
  updateVCAccount,
} from "./state_utils";
import Multibase from "multibase";
import Multicodec from "multicodec";
import { publicKeyConvert } from "secp256k1";
import * as ethers from "ethers";

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

export async function _getDidKeyIdentifier(): Promise<{
  didUrl: string;
  pubKey: string;
  compressedKey: string;
}> {
  const vcAccount = await getVCAccount();
  let signedMsg;
  if (vcAccount.signedMessage === "") {
    signedMsg = await wallet.request({
      method: "personal_sign",
      params: ["test", "0xd593E6a4c89fC400496aFA79d10eB5947e55d0AB"], // you must have access to the specified account
    });
    if (!signedMsg || typeof signedMsg != "string")
      throw new Error("User denied request");
    vcAccount.signedMessage = signedMsg;
    await updateVCAccount(vcAccount);
  } else signedMsg = vcAccount.signedMessage;

  const message = "test";
  const msgHash = ethers.utils.hashMessage(message);
  const msgHashBytes = ethers.utils.arrayify(msgHash);

  let pubKey = ethers.utils.recoverPublicKey(msgHashBytes, signedMsg);
  console.log(pubKey);

  pubKey = pubKey.split("0x")[1];
  console.log(pubKey);

  const testBuffer = Buffer.from(pubKey, "hex");
  if (testBuffer.length === 64) pubKey = "04" + pubKey;

  const compressedKey = uint8ArrayToHex(
    publicKeyConvert(hexToUnit8Array(pubKey), true)
  );
  console.log(compressedKey);
  const didUrl = Buffer.from(
    Multibase.encode(
      "base58btc",
      Multicodec.addPrefix(
        "secp256k1-pub",
        //"ed25519-pub",
        Buffer.from(
          //"b1fd65a536427e516b307996be10e5901f3cb2974d38cf948db50a6841b2d7dc",
          compressedKey,
          "hex"
        )
      )
    )
  ).toString();
  console.log(didUrl);
  return { didUrl, pubKey, compressedKey };
}

export function uint8ArrayToHex(arr: any) {
  return Buffer.from(arr).toString("hex");
}

export function hexToUnit8Array(str: any) {
  return new Uint8Array(Buffer.from(str, "hex"));
}
