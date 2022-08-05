import { IKey, RequireOnly, IIdentifier } from "@veramo/core";
import { AbstractKeyStore } from "@veramo/key-manager";
import {
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
} from "@veramo/key-manager";
import { AbstractDIDStore } from "@veramo/did-manager";
import { v4 as uuidv4 } from "uuid";
import { AbstractVCStore } from "@blockchain-lab-um/veramo-vc-manager/build/vc-store/abstract-vc-store";
import { VerifiableCredential } from "@veramo/core";
import { getVCAccount, updateVCAccount } from "../../../utils/state_utils";

export type ImportablePrivateKey = RequireOnly<
  ManagedPrivateKey,
  "privateKeyHex" | "type"
>;

/**
 * An implementation of {@link AbstractKeyStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the private key data.
 */

export class SnapKeyStore extends AbstractKeyStore {
  private keys: Record<string, IKey> = {};

  async get({ kid }: { kid: string }): Promise<IKey> {
    const ssiAccountState = await getVCAccount();
    const key = ssiAccountState.snapKeyStore[kid];
    if (!key) throw Error("Key not found");
    return key;
  }

  async delete({ kid }: { kid: string }) {
    const ssiAccountState = await getVCAccount();
    try {
      delete ssiAccountState.snapKeyStore[kid];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: IKey) {
    const ssiAccountState = await getVCAccount();
    ssiAccountState.snapKeyStore[args.kid] = { ...args };
    await updateVCAccount(ssiAccountState);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  async list(args: {}): Promise<Exclude<IKey, "privateKeyHex">[]> {
    const ssiAccountState = await getVCAccount();
    const safeKeys = Object.values(ssiAccountState.snapKeyStore).map((key) => {
      const { privateKeyHex, ...safeKey } = key;
      return safeKey;
    });
    return safeKeys;
  }
}

/**
 * An implementation of {@link AbstractPrivateKeyStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the key data.
 */

export class SnapPrivateKeyStore extends AbstractPrivateKeyStore {
  async get({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    const ssiAccountState = await getVCAccount();
    const key = ssiAccountState.snapPrivateKeyStore[alias];
    if (!key) throw Error(`not_found: PrivateKey not found for alias=${alias}`);
    return key;
  }

  async delete({ alias }: { alias: string }) {
    const ssiAccountState = await getVCAccount();
    try {
      delete ssiAccountState.snapPrivateKeyStore[alias];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: ImportablePrivateKey) {
    const ssiAccountState = await getVCAccount();
    const alias = args.alias || uuidv4();
    const existingEntry = ssiAccountState.snapPrivateKeyStore[alias];
    if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
      throw new Error(
        "key_already_exists: key exists with different data, please use a different alias"
      );
    }
    ssiAccountState.snapPrivateKeyStore[alias] = { ...args, alias };
    await updateVCAccount(ssiAccountState);
    return ssiAccountState.snapPrivateKeyStore[alias];
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    const ssiAccountState = await getVCAccount();
    return [...Object.values(ssiAccountState.snapPrivateKeyStore)];
  }
}

/**
 * An implementation of {@link AbstractDIDStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/did-manager} to hold the did key data.
 */

export class SnapDIDStore extends AbstractDIDStore {
  async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    const ssiAccountState = await getVCAccount();
    if (did && !alias) {
      if (!ssiAccountState.identifiers[did])
        throw Error(`not_found: IIdentifier not found with did=${did}`);
      return ssiAccountState.identifiers[did];
    } else if (!did && alias && provider) {
      for (const key of Object.keys(ssiAccountState.identifiers)) {
        if (
          ssiAccountState.identifiers[key].alias === alias &&
          ssiAccountState.identifiers[key].provider === provider
        ) {
          return ssiAccountState.identifiers[key];
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
    const ssiAccountState = await getVCAccount();
    try {
      delete ssiAccountState.identifiers[did];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: IIdentifier) {
    const ssiAccountState = await getVCAccount();
    const identifier = { ...args };
    for (const key of identifier.keys) {
      if (key.privateKeyHex) {
        delete key.privateKeyHex;
      }
    }
    ssiAccountState.identifiers[args.did] = identifier;
    await updateVCAccount(ssiAccountState);
    return true;
  }

  async list(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    const ssiAccountState = await getVCAccount();
    let result: IIdentifier[] = [];

    for (const key of Object.keys(ssiAccountState.identifiers)) {
      result.push(ssiAccountState.identifiers[key]);
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

/**
 * An implementation of {@link AbstractVCStore} that holds everything in snap state.
 *
 * This is usable by {@link @vc-manager/VCManager} to hold the vc data
 */

export class SnapVCStore extends AbstractVCStore {
  async get(args: { id: string }): Promise<VerifiableCredential | null> {
    const ssiAccountState = await getVCAccount();
    const vc = ssiAccountState.vcs[args.id];
    if (!vc) throw Error(`not_found: VC not found for alias=${args.id}`);
    return vc;
  }

  async delete({ id }: { id: string }) {
    const ssiAccountState = await getVCAccount();
    try {
      delete ssiAccountState.vcs[id];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: VerifiableCredential) {
    const ssiAccountState = await getVCAccount();
    let alias = uuidv4();

    while (ssiAccountState.vcs[alias]) {
      alias = uuidv4();
    }

    ssiAccountState.vcs[alias] = { ...args };
    await updateVCAccount(ssiAccountState);
    return true;
  }

  async list(args: { querry?: any }): Promise<VerifiableCredential[]> {
    const ssiAccountState = await getVCAccount();

    const result: VerifiableCredential[] = [];

    Object.keys(ssiAccountState.vcs).forEach((key) => {
      result.push({ ...ssiAccountState.vcs[key], key: key });
    });

    return result;
  }
}
