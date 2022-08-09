/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  _changeInfuraToken,
  _togglePopups,
  _addFriendlyDapp,
  _getFriendlyDapps,
  _removeFriendlyDapp,
} from "../utils/snap_utils";
import { getConfig } from "../utils/state_utils";

export async function togglePopups(): Promise<boolean> {
  const config = await getConfig();

  const result =
    config.dApp.disablePopups ||
    (await wallet.request({
      method: "snap_confirm",
      params: [
        {
          prompt: `Toggle Popups`,
          description: "Would you like to toggle the popups to following?",
          textAreaContent:
            "Current setting: " +
            config.dApp.disablePopups +
            "\n" +
            "New setting: " +
            !config.dApp.disablePopups,
        },
      ],
    }));
  if (result) {
    await _togglePopups();
    return true;
  }
  return false;
}

export async function changeInfuraToken(token?: string): Promise<boolean> {
  if (token != null && token != "") {
    const config = await getConfig();
    const result = await wallet.request({
      method: "snap_confirm",
      params: [
        {
          prompt: `Change Infura Token`,
          description:
            "Would you like to change the infura token to following?",
          textAreaContent:
            "Current token: " +
            config.veramo.infuraToken +
            "\n" +
            "New token: " +
            token,
        },
      ],
    });
    if (result) {
      await _changeInfuraToken(token);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
