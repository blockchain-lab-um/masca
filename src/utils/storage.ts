import { Wallet } from "../interfaces";
import { encode, decode } from "js-base64";
import { generatePkey, createPresentation } from "./createDid";

declare let wallet: Wallet;

interface W3CCredential {
  "@context": string[];
  id?: string;
  type: string[];
  issuer: { id: string; [x: string]: any };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id?: string;
    [x: string]: any;
  };
  credentialStatus?: {
    id: string;
    type: string;
  };
  [x: string]: any;
}

interface VerifiableCredential extends W3CCredential {
  proof: {
    type?: string;
    [x: string]: any;
  };
}

interface StorageData {
  pKey: string;
  address: string;
  vcs: Array<VerifiableCredential>;
}
interface Storage {
  storage: string;
}

async function updateState(data: StorageData) {
  const stringifiedData = JSON.stringify(data);
  console.log("Saving str data...", stringifiedData);
  await wallet.request({
    method: "snap_manageState",
    params: ["update", { storage: stringifiedData }],
  });
}

async function getState(): Promise<StorageData> {
  let persistedData = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as Storage;
  console.log("Preparsed data...", persistedData);
  const parsedData = JSON.parse(persistedData.storage) as StorageData;
  console.log("Parsed data...", parsedData);
  return parsedData;
}

export async function initializeStorage() {
  console.log("Initializing storage...");
  const [vc_address, vc_privateKey] = generatePkey();
  const initialState = { pKey: vc_privateKey, address: vc_address, vcs: [] };
  await updateState(initialState);
}

export async function saveVC(data: VerifiableCredential) {
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
  console.log("new data", data);
  console.log("Updated persisted data", persistedData);
  console.log("Updated persisted data", persistedData.vcs[0]);
  await updateState(persistedData);
}

export async function getVC() {
  const persistedData = await getState();
  console.log(persistedData.pKey);
  console.log(persistedData.vcs[0]);
  if (
    persistedData &&
    Object.keys(persistedData).length === 0 &&
    Object.getPrototypeOf(persistedData) === Object.prototype
  ) {
    return;
  } else {
    if (persistedData.vcs[0]) {
      createPresentation(
        persistedData.vcs[0],
        persistedData.pKey,
        persistedData.address
      );
    }
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
