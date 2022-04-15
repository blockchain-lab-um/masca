import { IKey, RequireOnly, IIdentifier } from "@veramo/core";
import { AbstractKeyStore } from "@veramo/key-manager";
import {
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
} from "@veramo/key-manager";
import { AbstractDIDStore } from "@veramo/did-manager";
import { v4 as uuidv4 } from "uuid";
import { VCStateVeramo, State, Wallet } from "../interfaces";

export type ImportablePrivateKey = RequireOnly<
  ManagedPrivateKey,
  "privateKeyHex" | "type"
>;

declare let wallet: Wallet;

async function updateVCState(vcState: VCStateVeramo) {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;

  //TODO Get current addr -> save/check under current addr + encrypt/decrypt...

  console.log("VC state in snap update", state);
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

async function getVCState(): Promise<VCStateVeramo> {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;
  console.log("VC state in snap", state);
  //if state is null
  if (state != null) {
    if (
      "snapPrivateKeyStore" in state.vcSnapState &&
      "snapKeyStore" in state.vcSnapState &&
      "identifiers" in state.vcSnapState
    ) {
      return state.vcSnapState as VCStateVeramo;
    } else
      return {
        snapPrivateKeyStore: {},
        snapKeyStore: {},
        identifiers: {},
      } as VCStateVeramo;
  } else
    return {
      snapPrivateKeyStore: {},
      snapKeyStore: {},
      identifiers: {},
    } as VCStateVeramo;
}

export class SnapKeyStore extends AbstractKeyStore {
  private keys: Record<string, IKey> = {};

  async get({ kid }: { kid: string }): Promise<IKey> {
    let vcState = await getVCState();
    const key = vcState.snapKeyStore[kid];
    if (!key) throw Error("Key not found");
    return key;
  }

  async delete({ kid }: { kid: string }) {
    //delete this.keys[kid];
    return true;
  }

  async import(args: IKey) {
    let vcState = await getVCState();
    vcState.snapKeyStore[args.kid] = { ...args };
    await updateVCState(vcState);
    return true;
  }

  async list(args: {}): Promise<Exclude<IKey, "privateKeyHex">[]> {
    let vcState = await getVCState();
    const safeKeys = Object.values(vcState.snapKeyStore).map((key) => {
      const { privateKeyHex, ...safeKey } = key;
      return safeKey;
    });
    return safeKeys;
  }
}

/**
 * An implementation of {@link AbstractPrivateKeyStore} that holds everything in memory.
 *
 * This is usable by {@link @veramo/kms-local} to hold the private key data.
 */

export class SnapPrivateKeyStore extends AbstractPrivateKeyStore {
  private privateKeys: Record<string, ManagedPrivateKey> = {};

  async get({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    let vcState = await getVCState();
    const key = vcState.snapPrivateKeyStore[alias];
    if (!key) throw Error(`not_found: PrivateKey not found for alias=${alias}`);
    return key;
  }

  async delete({ alias }: { alias: string }) {
    //delete this.privateKeys[alias];
    return true;
  }

  async import(args: ImportablePrivateKey) {
    let vcState = await getVCState();
    const alias = args.alias || uuidv4();
    const existingEntry = vcState.snapPrivateKeyStore[alias];
    if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
      throw new Error(
        "key_already_exists: key exists with different data, please use a different alias"
      );
    }
    vcState.snapPrivateKeyStore[alias] = { ...args, alias };
    await updateVCState(vcState);
    return vcState.snapPrivateKeyStore[alias];
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    let vcState = await getVCState();
    return [...Object.values(vcState.snapPrivateKeyStore)];
  }
}

export class SnapDIDStore extends AbstractDIDStore {
  private identifiers: Record<string, IIdentifier> = {};

  async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    let vcState = await getVCState();
    if (did && !alias) {
      if (!vcState.identifiers[did])
        throw Error(`not_found: IIdentifier not found with did=${did}`);
      return vcState.identifiers[did];
    } else if (!did && alias && provider) {
      for (const key of Object.keys(vcState.identifiers)) {
        if (
          vcState.identifiers[key].alias === alias &&
          vcState.identifiers[key].provider === provider
        ) {
          return vcState.identifiers[key];
        }
      }
    } else {
      throw Error("invalid_argument: Get requires did or (alias and provider)");
    }
    throw Error(
      `not_found: IIdentifier not found with alias=${alias} provider=${provider}`
    );
  }

  async delete({ did }: { did: string }) {
    //delete this.identifiers[did];
    return true;
  }

  async import(args: IIdentifier) {
    let vcState = await getVCState();
    const identifier = { ...args };
    for (const key of identifier.keys) {
      if (key.privateKeyHex) {
        delete key.privateKeyHex;
      }
    }
    vcState.identifiers[args.did] = identifier;
    await updateVCState(vcState);
    return true;
  }

  async list(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    let vcState = await getVCState();
    let result: IIdentifier[] = [];

    for (const key of Object.keys(vcState.identifiers)) {
      result.push(vcState.identifiers[key]);
    }

    if (args.alias && !args.provider) {
      result = result.filter((i) => i.alias === args.alias);
    } else if (args.provider && !args.alias) {
      result = result.filter((i) => i.provider === args.provider);
    } else if (args.provider && args.alias) {
      result = result.filter(
        (i) => i.provider === args.provider && i.alias === args.alias
      );
    }

    return result;
  }
}
