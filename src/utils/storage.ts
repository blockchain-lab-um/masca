import { Wallet } from "../interfaces";
import { encode, decode } from "js-base64";

declare let wallet: Wallet;

interface Data {
  pKey: string;
  vcs: Array<Object>;
}

async function updateState(data: Data) {
  await wallet.request({
    method: "snap_manageState",
    params: ["update", data],
  });
}

async function getState(): Promise<Data> {
  let persistedData = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as Data;
  return persistedData;
}

export async function initializeStorage() {
  console.log("Initializing storage...");
  //Generate privateKey
  const privateKeyValue = "testKey";
  const initialState = { pKey: privateKeyValue, vcs: [] };
  await updateState(initialState);
}

export async function saveVC(data: Object) {
  let persistedData = await getState();
  console.log("Persisted data:", persistedData);
  if (
    (persistedData &&
      Object.keys(persistedData).length === 0 &&
      Object.getPrototypeOf(persistedData) === Object.prototype) ||
    persistedData === null
  ) {
    console.log("Initialize storage first!");
    throw new Error("Initialize storage first!");
  }
  persistedData.vcs.push(data);
  await updateState(persistedData);
}

export async function getVC() {
  const persistedData = await getState();
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

export function getPrivateKey() {}

export async function isInitialized() {
  let persistedData = await getState();
  return !(
    (persistedData &&
      Object.keys(persistedData).length === 0 &&
      Object.getPrototypeOf(persistedData) === Object.prototype) ||
    persistedData === null
  );
}

export async function clearState() {
  await wallet.request({
    method: "snap_manageState",
    params: ["clear"],
  });
}
