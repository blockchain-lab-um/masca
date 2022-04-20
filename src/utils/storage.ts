import { Wallet, State, VCState, VCStateAccount } from "../interfaces";

declare let wallet: Wallet;

/**
 * Internal function for updating the state of VCSnap in MetaMask
 * This function will only update state for the VCSnap and will not change the state created by other Snaps.
 *
 * @interface VCState is an object with properties named after MetaMask account addresses. Those properties have VCStateAccount objects.
 *
 * @private
 *
 * @param vcState - @interface VCState to replace current state of this specific Snap.
 *
 * @beta
 *
 **/

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
    console.log("Creating state,", state, "With", vcState);
    state = { vcSnapState: vcState };
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
  }
}

/**
 * Internal function to retrieve VCState
 *
 * @private
 *
 * @returns @interface VCState
 *
 * @beta
 *
 **/
async function getVCState(): Promise<VCState> {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;
  if (state != null) {
    if ("vcSnapState" in state) {
      return state.vcSnapState as VCState;
    } else return {} as VCState;
  } else return {} as VCState;
}

/**
 * Function that returns promise of snap storage (VCStateAccount) for the selected MetaMask account.
 * If property in state for the selected account does not exists, it initializes it.
 *
 * @public
 *
 * @returns @interface VCStateAccount - includes privateKeyStore, keyStore, dIdentifiers and vcs.
 *
 * @beta
 *
 **/
export async function getVCAccount(): Promise<VCStateAccount> {
  let vcSnapState = await getVCState();
  console.log("VC account vc state", vcSnapState);
  const address = await getCurrentAccount();
  if (address in vcSnapState) {
    console.log("VC account decrypted account", vcSnapState[address]);
    return vcSnapState[address];
  } else {
    console.log("VC Account doesnt exist yet. Initializing account...");
    const emptyVCAccountDecrypted = await initializeVCAccount(address);
    return emptyVCAccountDecrypted;
  }
}

/**
 * Function that updates the snap storage (VCStateAccount) for the selected MetaMask account
 *
 * @public
 *
 * @param data - @interface VCStateAccount that will replace the current snap state for the selected MetaMask account
 *
 * @beta
 *
 **/
export async function updateVCAccount(data: VCStateAccount) {
  const address = await getCurrentAccount();
  let vcSnapState = await getVCState();
  vcSnapState[address] = data;
  console.log("Update VC account new state", vcSnapState);
  await updateVCState(vcSnapState);
}

/**
 * Function that creates empty VCStateAccount in snap State.
 *
 * Empty VCStateAccount is required for other functions to work properly.
 *
 * @private
 *
 * @param address - MetaMask address
 *
 * @returns @interface VCStateAccount - returns empty VCStateAccount
 *
 * @beta
 *
 **/
async function initializeVCAccount(address): Promise<VCStateAccount> {
  const emptyVCAccountDecrypted = {
    snapKeyStore: {},
    snapPrivateKeyStore: {},
    vcs: [],
    identifiers: {},
  } as VCStateAccount;
  let vcState = await getVCState();
  vcState[address] = emptyVCAccountDecrypted;
  await updateVCState(vcState);
  return emptyVCAccountDecrypted;
}

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns address - MetaMask address
 *
 * @beta
 *
 **/
async function getCurrentAccount(): Promise<string> {
  try {
    let accounts = (await wallet.request({
      method: "eth_requestAccounts",
    })) as Array<string>;
    const account = accounts[0];
    console.log("Current accounts:", accounts);
    return account;
  } catch (e) {
    console.log(e);
    return "0x0";
  }
}

// async function getVCAccountEncPubKey() {
//   const address = await getCurrentAccount();
//   let vcSnapState = await getVCState();
//   console.log("get enc pub key state", vcSnapState);
//   if (address in vcSnapState) {
//     console.log("address in vcsnapstate");
//     return vcSnapState[address].encPubKey;
//   }
//   return null;
// }
// export async function initializeVCAccount(address: string) {
//   if (ethers.utils.isAddress(address)) {
//     let vcSnapState = await getVCState();
//     if (address in vcSnapState && vcSnapState[address].encPubKey != null)
//       return false;

//     let encPubKey = await getEncryptionPublicKey(address);
//     if (encPubKey) {
//       console.log("Creating new account...");
//       const [vc_address, vc_privateKey] = generatePkey();
//       const newVCAccount = {
//         pKey: vc_privateKey,
//         address: vc_address,
//         vcs: [],
//       } as DecryptedVCData;
//       let encryptedData = encryptVCStorage(newVCAccount, {
//         account: address,
//         encPubKey: encPubKey,
//       });
//       vcSnapState[address] = {
//         encryptedData: encryptedData,
//         encPubKey: encPubKey,
//       };
//       await updateVCState(vcSnapState);
//       console.log("Initialization finished");
//       return true;
//     } else {
//       console.log("Failed");
//       return false;
//     }
//   } else {
//     console.log("Address is not valid");
//   }
// }

// export async function getVCs(address: string) {
//   if (ethers.utils.isAddress(address)) {
//     let vcAccount = await getVCAccount(address);
//     if (vcAccount != null) {
//       return vcAccount.vcs;
//     } else {
//       console.log("VC account is empty");
//       return [];
//     }
//   } else {
//     console.log("Address is not valid!");
//     return [];
//   }
// }

// export async function saveVC(address: string, data: VerifiableCredential) {
//   if (ethers.utils.isAddress(address)) {
//     let vcAccount = await getVCAccount(address);
//     if (vcAccount != null) {
//       vcAccount.vcs.push(data);
//       console.log("New VC", vcAccount);
//       await updateVCAccount(address, vcAccount);
//     } else {
//       console.log("Account is not initialized yet");
//     }
//   } else {
//     console.log("Address is not valid");
//   }
// }

// export async function getVP(address: string, vc_id: number) {
//   if (ethers.utils.isAddress(address)) {
//     let vcAccount = await getVCAccount(address);
//     if (vcAccount != null) {
//       if (vcAccount.vcs.length > vc_id) {
//         const result = await wallet.request({
//           method: "snap_confirm",
//           params: [
//             {
//               prompt: `User ${address.substring(0, 15)}...`,
//               description: "Would you like to sign following VC?",
//               textAreaContent: JSON.stringify(
//                 vcAccount.vcs[vc_id].credentialSubject
//               ),
//             },
//           ],
//         });
//         if (result) {
//           const vp = await createPresentation(
//             vcAccount.vcs[vc_id],
//             vcAccount.pKey,
//             vcAccount.address
//           );
//           return vp;
//         } else {
//           return null;
//         }
//       } else {
//         console.log("Index is not matching any VC");
//       }
//     } else {
//       console.log("VC account is empty");
//       return null;
//     }
//   } else {
//     console.log("Address is not valid");
//     return null;
//   }
// }

// function encryptVCStorage(data: VCStateAccount, encPubKey: string) {
//   console.log("Encrypting ", data);
//   const encryptedMessage = ethUtil.bufferToHex(
//     Buffer.from(
//       JSON.stringify(
//         sigUtil.encrypt({
//           publicKey: encPubKey,
//           data: JSON.stringify(data),
//           version: "x25519-xsalsa20-poly1305",
//         })
//       ),
//       "utf8"
//     )
//   );
//   console.log("Encrypted message", encryptedMessage);
//   return encryptedMessage;
// }

// async function decryptVCStorage(
//   encryptedData: string,
//   address: string
// ): Promise<VCStateAccountDecrypted> {
//   let decryptedState;
//   console.log("Decrypting state ", encryptedData);
//   try {
//     decryptedState = JSON.parse(
//       (await wallet.request({
//         method: "eth_decrypt",
//         params: [encryptedData, address],
//       })) as string
//     );
//   } catch (e) {
//     console.log(e as Error);
//     return {
//       snapKeyStore: {},
//       snapPrivateKeyStore: {},
//       vcs: [],
//       identifiers: {},
//     };
//   }
//   console.log("Decrypted state: ", decryptedState);
//   if (!("snapPrivateKeyStore" in decryptedState))
//     decryptedState.snapPrivateKeyStore = {};
//   if (!("snapKeyStore" in decryptedState)) decryptedState.snapKeyStore = {};
//   if (!("identifiers" in decryptedState)) decryptedState.identifiers = {};
//   if (!("vcs" in decryptedState)) decryptedState.vcs = [];
//   return decryptedState as VCStateAccountDecrypted;
// }

// async function getEncryptionPublicKey(address: string): Promise<string | null> {
//   try {
//     let encryptionPublicKey = await wallet.request({
//       method: "eth_getEncryptionPublicKey",
//       params: [address], // you must have access to the specified account
//     });
//     return encryptionPublicKey as string;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// export async function getVCAccountAddress() {
//   const address = await getCurrentAccount();
//   if (ethers.utils.isAddress(address)) {
//     let vcAccount = await getVCAccount();
//     console.log("GEtting VC account", vcAccount);
//     if (vcAccount != null) {
//       console.log("VC acc address", vcAccount.address);
//       return vcAccount.address;
//     } else {
//       console.log("VC account is empty");
//       return null;
//     }
//   } else {
//     console.log("Address is not valid");
//     return null;
//   }
// }
