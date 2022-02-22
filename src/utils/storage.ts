import { Wallet } from "../interfaces";
import { encode, decode } from "js-base64";

declare let wallet: Wallet;

interface Data {
  vcs: string;
}

export async function saveVC(data: string) {
  const a = await wallet.request({
    method: "snap_manageState",
    params: ["update", { vcs: ["test1", "test2", "test3"] }],
    //params: ["update", { vcs: encode(data) }],
  });
  console.log(a);
}

export async function getVC() {
  const persistedData = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as Data;
  console.log(persistedData);
  if (
    persistedData &&
    Object.keys(persistedData).length === 0 &&
    Object.getPrototypeOf(persistedData) === Object.prototype
  ) {
    return;
  } else {
    //console.log(decode((persistedData as Data).vcs));
  }
}

export async function clearState() {
  await wallet.request({
    method: "snap_manageState",
    params: ["clear"],
  });
}
