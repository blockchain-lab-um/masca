import { agent } from "../veramo/setup";
import {
  IIdentifier,
  VerifiableCredential,
  VerifiablePresentation,
} from "@veramo/core";

/**
 * Get an existing or create a new DID for the currently selected MetaMask account.
 * @returns {Promise<IIdentifier>} a DID.
 */
export async function get_id() {
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
  vc_id: number
): Promise<VerifiablePresentation | null> {
  let identifier = await get_id();

  const vc = await agent.getVC({ id: vc_id });
  if (vc != null) {
    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: identifier,
        verifier: [],
        verifiableCredential: [vc],
      },
      proofFormat: "jwt",
      save: true,
    });
    console.log("....................VP..................");
    console.log(vp);
    return vp;
  } else {
    console.log("No VC found...");
    return null;
  }
}
