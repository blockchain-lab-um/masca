import {
  Wallet,
  StorageData,
  Storage,
  VerifiableCredential,
  W3CCredential,
} from "../interfaces";
import { encode, decode } from "js-base64";
import { generatePkey, createPresentation } from "./createDid";

declare let wallet: Wallet;

//Internal function for updating state, should only work with StorageData Interface
async function updateState(data: StorageData) {
  const stringifiedData = JSON.stringify(data);
  console.log("Saving str data...", stringifiedData);
  await wallet.request({
    method: "snap_manageState",
    params: ["update", { storage: stringifiedData }],
  });
}

//Internal function for reading State, should throw an error if storage is uninitialized
async function getState(): Promise<StorageData> {
  let persistedData = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as Storage;

  if (
    (persistedData &&
      Object.keys(persistedData).length === 0 &&
      Object.getPrototypeOf(persistedData) === Object.prototype) ||
    persistedData === null
  ) {
    console.log("Initialize storage first!");
    throw new Error("Initialize storage first!");
  }

  const parsedData = JSON.parse(persistedData.storage) as StorageData;
  return parsedData;
}

//Function to initialize storage. Must be called before any other storage related functionality
export async function initializeStorage() {
  console.log("Initializing storage...");
  const [vc_address, vc_privateKey] = generatePkey();
  const initialState = { pKey: vc_privateKey, address: vc_address, vcs: [] };
  await updateState(initialState);
}

//Function for saving VCs in storage
export async function saveVC(data: VerifiableCredential) {
  let persistedData = await getState();
  console.log("Persisted data:", persistedData);
  persistedData.vcs.push(data);
  await updateState(persistedData);
}

//test function
export async function getVC() {
  const persistedData = await getState();
  if (persistedData.vcs[0]) {
    createPresentation(
      persistedData.vcs[0],
      persistedData.pKey,
      persistedData.address
    );
  }
  return;
}

//Create VP from VC with id id
export async function getVP(id: number) {
  const persistedData = await getState();
  if (persistedData.vcs[id]) {
    const vp = await createPresentation(
      persistedData.vcs[id],
      persistedData.pKey,
      persistedData.address
    );
    return vp;
  }
  return "Error";
}

export function getPrivateKey() {}

//Get ETH address from VC Account
export async function getVcAddress() {
  const persistedData = await getState();
  return persistedData.address;
}

//Get a list of VCs stored in MM state
export async function getVcs(): Promise<Array<VerifiableCredential> | null> {
  const persistedData = await getState();
  return persistedData.vcs;
}

//Return true if no error for uniniitialized storage has been thrown
export async function isInitialized() {
  try {
    let persistedData = await getState();
  } catch (e) {
    return false;
  }
  return true;
}

//Test function for clearing state
export async function clearState() {
  await wallet.request({
    method: "snap_manageState",
    params: ["clear"],
  });
}

// TODO
// Delete VC,
