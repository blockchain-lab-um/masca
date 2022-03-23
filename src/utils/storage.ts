import {
  Wallet,
  VCStorage,
  MMState,
  VerifiableCredential,
  MMStateRaw,
  VCEncryptionAccount,
} from "../interfaces";
import { generatePkey, createPresentation } from "./createDid";

const ethUtil = require("ethereumjs-util");
const sigUtil = require("@metamask/eth-sig-util");

declare let wallet: Wallet;

//Internal function for updating state, should only work with StorageData Interface
async function updateState(data: MMStateRaw) {
  await wallet.request({
    method: "snap_manageState",
    params: ["update", data],
  });
}

async function getState(): Promise<MMStateRaw> {
  let persistedData = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as MMStateRaw;
  return persistedData;
}

function encryptVCStorage(vcEncryptionAccount, message: VCStorage) {
  console.log("Encrypting ", message);
  const encryptedMessage = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey: vcEncryptionAccount.encPubKey,
          data: message,
          version: "x25519-xsalsa20-poly1305",
        })
      ),
      "utf8"
    )
  );
  console.log("Encrypted message", encryptedMessage);
  return encryptedMessage;
}

async function decryptVCStorage(vcEncryptionAccount, encryptedState) {
  let decriptedState;
  console.log("Decrypting state ", encryptedState);
  try {
    decriptedState = wallet.request({
      method: "eth_decrypt",
      params: [encryptedState, vcEncryptionAccount.account],
    });
  } catch (e) {
    console.log(e as Error);
    return null;
  }
  return decriptedState;
}

async function 

//Internal function for reading State, should throw an error if storage is uninitialized
async function getVCState(): Promise<MMState> {
  let persistedData = await getStateRaw();
  let state;
  //State doesnt exist yet
  if (persistedData == null) {
    state = (await initializeStorage({} as MMStateRaw)) as MMState;
    console.log("Finished initalizing storage..");
    throw new Error("Encryption Account Missing!");
    //Storage exists and Encryption account is present
  } else if (
    "vcStorage" in persistedData &&
    "vcEncryptionAccount" in persistedData
  ) {
    console.log("Storage already initialized");

    state = decryptVCStorage(
      persistedData.vcEncryptionAccount,
      persistedData.vcStorage
    );
  } else if ("vcEncryptionAccount" in persistedData) {
    state = (await initializeStorage(persistedData)) as MMState;
    console.log("Finished initalizing storage..");
  } else {
    throw new Error("Encryption Account missing!");
  }

  console.log("MetaMask state:", state);

  return state;
}

async function getEncryptionPublicKey(account) {
  try {
    let encryptionPublicKey = await wallet.request({
      method: "eth_getEncryptionPublicKey",
      params: [account], // you must have access to the specified account
    });
    return encryptionPublicKey;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function initializeEncryptionAccount(account: string) {
  let encryptionPublicKey = await getEncryptionPublicKey(account);
  if (encryptionPublicKey != null) {
    let state = await getStateRaw();
    if (state == null) {
      state = (await initializeStorage({} as MMStateRaw)) as MMState;
      console.log("Finished initalizing storage..");
    }
    state.vcEncryptionAccount = {
      account: account,
      encPubKey: encryptionPublicKey,
    };
    console.log("Updating state with enc key:", state);
    await updateState(state);
    return true;
  } else {
    return false;
  }
}

async function getEncryptionAccount(): Promise<VCEncryptionAccount | boolean> {
  let state = await getStateRaw();
  if ("vcEncryptionAccount" in state) {
    return state.vcEncryptionAccount;
  } else return false;
}

//Function to initialize storage. Must be called before any other storage related functionality.
export async function initializeStorage(account: string) {
  console.log("Initializing storage...");
  //Get already existing state
  let existingState = await getStateRaw();

  //Get Encryption Public Key
  let encryptionPublicKey = await getEncryptionPublicKey(account);

  //Generate new VC account
  const [vc_address, vc_privateKey] = generatePkey();

  const initialState = {
    pKey: vc_privateKey,
    address: vc_address,
    vcs: [],
  } as VCStorage;

  let encryptedVCStorage = await encryptVCStorage(
    data.vcEncryptionAccount,
    initialState
  );

  data.vcStorage = encryptedVCStorage;
  await updateState(data);
  console.log("Storage initialized!");
  return data;
}

//Function for saving VCs in storage
////TODO check validity of VC structure
export async function saveVC(data: VerifiableCredential) {
  let persistedData = await getVCState();
  persistedData.vcStorage.vcs.push(data);
  await updateState(persistedData);
}

//test function
export async function getVC() {
  const persistedData = await getVCState();
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
  const persistedData = await getVCState();
  let vcStorage = persistedData.vcStorage;
  if (vcStorage.vcs[id]) {
    const vp = await createPresentation(
      vcStorage.vcs[id],
      vcStorage.pKey,
      vcStorage.address
    );
    return vp;
  }
  return "Error";
}

export function getPrivateKey() {}

//Get ETH address from VC Account
export async function getVcAddress() {
  const persistedData = await getVCState();
  return persistedData.vcStorage.address;
}

//Get a list of VCs stored in MM state
export async function getVcs(): Promise<Array<VerifiableCredential> | null> {
  const persistedData = await getVCState();
  return persistedData.vcStorage.vcs;
}

//Return true if no error for uniniitialized storage has been thrown
//TODO
export async function isInitialized() {
  try {
    let persistedData = await getVCState();
  } catch (e) {
    return false;
  }
  return false;
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
