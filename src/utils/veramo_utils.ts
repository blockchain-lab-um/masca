import { agent } from "../veramo/setup";
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
} from "@veramo/core";
import { getCurrentAccount } from "./snap_utils";
import { getVCAccount } from "./state_utils";
declare let wallet: any;

/**
 * Get an existing or create a new DID for the currently selected MetaMask account.
 * @returns {Promise<IIdentifier>} a DID.
 */
export async function get_id(): Promise<IIdentifier> {
  const identifiers = await agent.didManagerFind();
  if (identifiers.length == 1) {
    console.log("DID Already exists for the selected MetaMask Account");
    return identifiers[0];
  } else {
    const identity = await agent.didManagerCreate();
    console.log(`New identity created`);
    console.log(identity);
    return identity;
  }
}

/**
 * Saves a VC in the state object of the currently selected MetaMask account.
 * @param {VerifiableCredential} vc - The VC.
 **/
export async function save_vc(vc: VerifiableCredential) {
  await agent.saveVC({ vc: vc });
}

/**
 * Get a list of VCs of the curently selected MetaMask account.
 * @returns {Promise<VerifiableCredential[]>} Array of saved VCs.
 */
export async function list_vcs() {
  const identifiers = await agent.listVCS();

  console.log(`There are ${identifiers.vcs.length} identifiers`);

  if (identifiers.vcs.length > 0) {
    identifiers.vcs.map((id) => {
      console.log(id);
      console.log("..................");
    });
  }
  return identifiers.vcs;
}

/**
 * Create a VP from a specific VC (if it exists), that is stored in MetaMask state under the currently selected MetaMask account.
 * @param {number} vc_id - index of the VC
 * @returns {Promise<VerifiablePresentation | null>} - generated VP
 **/
export async function create_vp(
  vc_id: number,
  challenge?: string,
  domain?: string
): Promise<VerifiablePresentation | null> {
  let identifier = await importMetaMaskAccount();

  const vc = await agent.getVC({ id: vc_id });
  if (vc.vc != null) {
    const result = await wallet.request({
      method: "snap_confirm",
      params: [
        {
          prompt: `Alert`,
          description: "Do you wish to create a VP from the following VC?",
          textAreaContent: JSON.stringify(vc.vc.credentialSubject),
        },
      ],
    });
    console.log("RESULT", result);
    console.log("VC", vc);
    if (result) {
      if (challenge) console.log("Challenge:", challenge);
      if (domain) console.log("Domain:", domain);
      const vp = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier,
          type: ["VerifiablePresentation", "Custom"],
          verifiableCredential: [vc.vc],
        },
        challenge: challenge,
        domain: domain,
        proofFormat: "EthereumEip712Signature2021",
        save: false,
      });
      console.log("....................VP..................");
      console.log(vp);
      return vp as VerifiablePresentation;
    } else {
      return null;
    }
  } else {
    console.log("No VC found...");
    return null;
  }
}

export const importMetaMaskAccount = async (): Promise<string> => {
  const account = await getCurrentAccount();
  let did = "did:ethr:0x4:" + account;

  const identifiers = agent.didManagerFind();
  let exists = false;
  (await identifiers).map((id) => {
    if (id.did == did) exists = true;
  });
  if (exists) {
    console.log("DID already exists");
    return did;
  }
  const controllerKeyId = `metamask-${account}`;
  await agent.didManagerImport({
    did,
    provider: "metamask",
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: "Secp256k1",
        kms: "web3",
        privateKeyHex: "",
        meta: {
          provider: "metamask",
          account: account.toLocaleLowerCase(),
          algorithms: ["eth_signMessage", "eth_signTypedData"],
        },
      } as MinimalImportableKey,
    ],
  });
  return did;
};

export async function create_vc() {
  const acc = await getVCAccount();
  console.log("Account state", acc);

  const id = await agent.didManagerCreate({
    provider: "snap",
  });

  //const account = await getCurrentAccount();
  // let did = "did:ethr:0x4:" + account;
  // // const controllerKeyId = `metamask-${account}`;
  // // await agent.didManagerImport({
  // //   did,
  // //   provider: "metamask",
  // //   controllerKeyId,
  // //   keys: [
  // //     {
  // //       kid: controllerKeyId,
  // //       type: "Secp256k1",
  // //       kms: "web3",
  // //       privateKeyHex: "",
  // //       meta: {
  // //         provider: "metamask",
  // //         account: account.toLocaleLowerCase(),
  // //         algorithms: ["eth_signMessage", "eth_signTypedData"],
  // //       },
  // //     } as MinimalImportableKey,
  // //   ],
  // // });

  const identifiers = await agent.didManagerFind();

  if (identifiers.length > 0) {
    identifiers.map((id: any) => {
      console.log(id);
      console.log("..................");
    });
  }
  // console.log("Resolving did...");
  //const result = await agent.resolveDid({ didUrl: did });

  const result = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: id.did },
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://example.com/1/2/3",
      ],
      type: ["VerifiableCredential", "Custom"],
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: "did:web:example.com",
        you: "Rock",
      },
    },
    proofFormat: "EthereumEip712Signature2021",
  });
  console.log("RESULT", result);
  return result;
}
