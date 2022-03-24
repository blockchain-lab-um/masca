import {
  Wallet,
  VerifiableCredential,
  VCEncryptionAccount,
  State,
  VCAccount,
  VCState,
  DecryptedVCData,
} from "../interfaces";
import { generatePkey, createPresentation } from "./createDid";
import { ethers } from "ethers";

//const ethUtil = require("ethereumjs-util");
const sigUtil = require("@metamask/eth-sig-util");
declare let wallet: Wallet;

async function updateVCState(vcState: VCState) {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;

  if (state != null) {
    console.log("Updating state,", state, "With", vcState);
    state.vcSnapState = vcState;
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
    //If state doesnt exist yet, it initializes it.
  } else {
    console.log("Updating state,", state, "With", vcState);
    state = { vcSnapState: vcState };
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
  }
}

async function getVCState(): Promise<VCState> {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;

  //if state is null
  if (state != null) {
    let vcState;
    if ("vcSnapState" in state) {
      return state.vcSnapState as VCState;
    } else return {} as VCState;
  } else return {} as VCState;
}

function encryptVCStorage(
  data: DecryptedVCData,
  vcEncryptionAccount: VCEncryptionAccount
) {
  console.log("Encrypting ", data);
  // const encryptedMessage = ethUtil.bufferToHex(
  //   Buffer.from(
  const encryptedMessage = JSON.stringify(
    sigUtil.encrypt({
      publicKey: vcEncryptionAccount.encPubKey,
      data: data,
      version: "x25519-xsalsa20-poly1305",
    })
  );
  //"utf8"
  //)
  //);
  console.log("Encrypted message", encryptedMessage);
  return encryptedMessage;
}

async function decryptVCStorage(
  data: string,
  address: string
): Promise<DecryptedVCData | null> {
  let decriptedState;
  console.log("Decrypting state ", data);
  try {
    decriptedState = await wallet.request({
      method: "eth_decrypt",
      params: [data, address],
    });
  } catch (e) {
    console.log(e as Error);
    return null;
  }
  return decriptedState;
}

async function getEncryptionPublicKey(address: string) {
  try {
    let encryptionPublicKey = await wallet.request({
      method: "eth_getEncryptionPublicKey",
      params: [address], // you must have access to the specified account
    });
    return encryptionPublicKey;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getVCAccount(address: string): Promise<DecryptedVCData | null> {
  let vcSnapState = await getVCState();
  console.log("VC account vc state", vcSnapState);
  if (address in vcSnapState) {
    let decryptedVCData = await decryptVCStorage(
      vcSnapState.address.encryptedData,
      address
    );
    console.log("VC account decrypted account", decryptedVCData);
    return decryptedVCData;
  } else {
    console.log("VC Account doesnt exist yet");
    return null;
  }
}

async function updateVCAccount(address: string, data: DecryptedVCData) {
  let encPubKey = await getEncryptionPublicKey(address);
  console.log("VC account encPubKey", encPubKey);

  if (encPubKey != null) {
    let encryptedData = encryptVCStorage(data, {
      account: address,
      encPubKey: encPubKey,
    });

    let vcSnapState = await getVCState();
    vcSnapState.address = { encryptedData: encryptedData };
    console.log("Update VC account new state", vcSnapState);
    await updateVCState(vcSnapState);
  } else {
    console.log("cant get pub key to encrypt data");
  }
}

export async function getVCs(address: string) {
  if (ethers.utils.isAddress(address)) {
    let vcAccount = await getVCAccount(address);
    if (vcAccount != null) {
      return vcAccount.vcs;
    } else {
      console.log("VC account is empty");
      return [];
    }
  } else {
    console.log("Address is not valid!");
    return [];
  }
}

export async function saveVC(address: string, data: VerifiableCredential) {
  if (ethers.utils.isAddress(address)) {
    let vcAccount = await getVCAccount(address);
    if (vcAccount != null) {
      vcAccount.vcs.push(data);
      console.log("New VC", vcAccount);
      await updateVCAccount(address, vcAccount);
    } else {
      console.log("vcAccount doesnt exist");
      console.log("Creating new account...");
      const [vc_address, vc_privateKey] = generatePkey();
      const newVCAccount = {
        pKey: vc_privateKey,
        address: vc_address,
        vcs: [data],
      } as DecryptedVCData;
      console.log("new account", newVCAccount);
      await updateVCAccount(address, newVCAccount);
    }
  } else {
    console.log("Address is not valid");
  }
}

export async function getVP(address: string, vc_id: number) {
  if (ethers.utils.isAddress(address)) {
    let vcAccount = await getVCAccount(address);
    if (vcAccount != null) {
      if (vcAccount.vcs.length > vc_id) {
        const vp = await createPresentation(
          vcAccount.vcs[vc_id],
          vcAccount.pKey,
          vcAccount.address
        );
        return vp;
      } else {
        console.log("Index is not matching any VC");
      }
    } else {
      console.log("VC account is empty");
      return null;
    }
  } else {
    console.log("Address is not valid");
    return null;
  }
}

export async function getVCAccountAddress(address: string) {
  if (ethers.utils.isAddress(address)) {
    let vcAccount = await getVCAccount(address);
    if (vcAccount != null) {
      return vcAccount.address;
    } else {
      console.log("VC account is empty");
      return null;
    }
  } else {
    console.log("Address is not valid");
    return null;
  }
}

//Internal function for reading State, should throw an error if storage is uninitialized
// async function getVCState(): Promise<MMState> {
//   let persistedData = await getStateRaw();
//   let state;
//   //State doesnt exist yet
//   if (persistedData == null) {
//     state = (await initializeStorage({} as MMStateRaw)) as MMState;
//     console.log("Finished initalizing storage..");
//     throw new Error("Encryption Account Missing!");
//     //Storage exists and Encryption account is present
//   } else if (
//     "vcStorage" in persistedData &&
//     "vcEncryptionAccount" in persistedData
//   ) {
//     console.log("Storage already initialized");

//     state = decryptVCStorage(
//       persistedData.vcEncryptionAccount,
//       persistedData.vcStorage
//     );
//   } else if ("vcEncryptionAccount" in persistedData) {
//     state = (await initializeStorage(persistedData)) as MMState;
//     console.log("Finished initalizing storage..");
//   } else {
//     throw new Error("Encryption Account missing!");
//   }

//   console.log("MetaMask state:", state);

//   return state;
// }

// export async function initializeEncryptionAccount(account: string) {
//   let encryptionPublicKey = await getEncryptionPublicKey(account);
//   if (encryptionPublicKey != null) {
//     let state = await getStateRaw();
//     if (state == null) {
//       state = (await initializeStorage({} as MMStateRaw)) as MMState;
//       console.log("Finished initalizing storage..");
//     }
//     state.vcEncryptionAccount = {
//       account: account,
//       encPubKey: encryptionPublicKey,
//     };
//     console.log("Updating state with enc key:", state);
//     await updateState(state);
//     return true;
//   } else {
//     return false;
//   }
// }

// async function getEncryptionAccount(): Promise<VCEncryptionAccount | boolean> {
//   let state = await getStateRaw();
//   if ("vcEncryptionAccount" in state) {
//     return state.vcEncryptionAccount;
//   } else return false;
// }

//Function to initialize storage. Must be called before any other storage related functionality.
// export async function initializeStorage(account: string) {
//   console.log("Initializing storage...");
//   //Get already existing state
//   let existingState = await getStateRaw();

//   //Get Encryption Public Key
//   let encryptionPublicKey = await getEncryptionPublicKey(account);

//   //Generate new VC account
//   const [vc_address, vc_privateKey] = generatePkey();

//   const initialState = {
//     pKey: vc_privateKey,
//     address: vc_address,
//     vcs: [],
//   } as VCStorage;

//   let encryptedVCStorage = await encryptVCStorage(
//     data.vcEncryptionAccount,
//     initialState
//   );

//   data.vcStorage = encryptedVCStorage;
//   await updateState(data);
//   console.log("Storage initialized!");
//   return data;
// }

//Function for saving VCs in storage
////TODO check validity of VC structure
// export async function saveVC(data: VerifiableCredential) {
//   let persistedData = await getVCState();
//   persistedData.vcStorage.vcs.push(data);
//   await updateState(persistedData);
// }

//test function
// export async function getVC() {
//   const persistedData = await getVCState();
//   if (persistedData.vcs[0]) {
//     createPresentation(
//       persistedData.vcs[0],
//       persistedData.pKey,
//       persistedData.address
//     );
//   }
//   return;
// }

//Create VP from VC with id id
// export async function getVP(id: number) {
//   const persistedData = await getVCState();
//   let vcStorage = persistedData.vcStorage;
//   if (vcStorage.vcs[id]) {
//     const vp = await createPresentation(
//       vcStorage.vcs[id],
//       vcStorage.pKey,
//       vcStorage.address
//     );
//     return vp;
//   }
//   return "Error";
// }

// export function getPrivateKey() {}

//Get ETH address from VC Account
// export async function getVcAddress() {
//   const persistedData = await getVCState();
//   return persistedData.vcStorage.address;
// }

// //Get a list of VCs stored in MM state
// export async function getVcs(): Promise<Array<VerifiableCredential> | null> {
//   const persistedData = await getVCState();
//   return persistedData.vcStorage.vcs;
// }

//Return true if no error for uniniitialized storage has been thrown
//TODO
// export async function isInitialized() {
//   try {
//     let persistedData = await getVCState();
//   } catch (e) {
//     return false;
//   }
//   return false;
// }

// //Test function for clearing state
// export async function clearState() {
//   await wallet.request({
//     method: "snap_manageState",
//     params: ["clear"],
//   });
// }

// TODO
// Delete VC,
