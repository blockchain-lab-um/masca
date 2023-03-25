/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
import {
  IAgentContext,
  ICredentialPlugin,
  IIdentifier,
  IKey,
  IKeyManager,
  IResolver,
  IService,
  ManagedKeyInfo,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import { ec as EC } from 'elliptic';
import * as jose from 'jose';

import { onboard } from './ebsi-did-onboarding.js';
import {
  algoMap,
  generateEbsiSubjectIdentifier,
  generateRandomEbsiSubjectIdentifier,
  privateKeyJwkToHex,
} from './ebsi-did-utils.js';
import {
  IEbsiCreateIdentifierOptions,
  IEbsiDidSupportedEcdsaAlgo,
  IEbsiDidSupportedHashTypes,
  IEbsiDidSupportedKeyTypes,
  IImportedKey,
} from './types/ebsi-provider-types.js';

type IContext = IAgentContext<IKeyManager & ICredentialPlugin & IResolver>;

/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:ebsi` identifiers
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class EbsiDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string;

  constructor(options: { defaultKms: string }) {
    super();
    this.defaultKms = options.defaultKms;
  }

  async createIdentifier(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    { kms, options }: { kms?: string; options?: IEbsiCreateIdentifierOptions },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    if (options?.id && options?.id.length !== 32) {
      throw new Error(
        'Subject identifier should be 16 bytes (32 characters in hex string, or Uint8Array) long'
      );
    }

    if (options?.privateKeyHex && !options?.id) {
      throw new Error(
        'Currently, subject identifier id should be provided along with a private key'
      );
    }

    if (options?.privateKeyHex && options?.privateKeyHex?.length !== 64) {
      throw new Error(
        'Private key should be 32 bytes (64 characters in hex string) long'
      );
    }

    const hashType: IEbsiDidSupportedHashTypes = options?.hashType || 'sha256';
    if (hashType !== 'sha256') {
      throw new Error('Currently, only sha256 hash type is supported');
    }
    const keyType = options?.keyType || 'Secp256k1';
    const importedKey = await this.importKey({
      privateKeyHex: options?.privateKeyHex,
      id: options?.id,
      keyType,
    });
    const { privateKeyHex } = importedKey;

    const kid = `did:ebsi:${importedKey.subjectIdentifier}#${importedKey.jwkThumbprint}`;
    const did = `did:ebsi:${importedKey.subjectIdentifier}`;
    let key: ManagedKeyInfo;
    const resolution = await context.agent.resolveDid({ didUrl: did });

    if (resolution.didDocument) {
      const resolvedVerificationMethod =
        resolution.didDocument.verificationMethod?.find((vm) => vm.id === kid);

      if (!resolvedVerificationMethod) {
        throw new Error(
          `${kid} does not match any key id in resolved did doc's verification method, check provided crv: ${keyType}`
        );
      }
      key = await context.agent.keyManagerImport({
        kid,
        privateKeyHex,
        type: keyType === 'P-256' ? 'Secp256r1' : keyType,
        kms: this.defaultKms || 'local',
      });
      return {
        did,
        controllerKeyId: kid,
        keys: [key],
        services: [],
      } as Omit<IIdentifier, 'provider'>;
    }

    if (!options?.bearer) {
      throw new Error(
        'Bearer token is required for onboarding, it should be passed as options parameter'
      );
    }
    const { bearer } = options;
    key = await context.agent.keyManagerImport({
      kid,
      privateKeyHex,
      type: keyType === 'P-256' ? 'Secp256r1' : keyType,
      kms: this.defaultKms || 'local',
    });

    const identifier = {
      did,
      controllerKeyId: kid,
      keys: [key],
      services: [],
    };

    const keyJwks = {
      privateKeyJwk: importedKey.privateKeyJwk,
      publicKeyJwk: importedKey.publicKeyJwk,
    };
    const onboardedResult = await onboard({ bearer, identifier, keyJwks });

    if (!onboardedResult) {
      throw new Error(
        'Unknown error while creating identifier (onboarding unsuccessful)'
      );
    }

    if (
      !onboardedResult.result ||
      (onboardedResult.result &&
        !(onboardedResult.result as string).startsWith('0x'))
    ) {
      throw new Error(
        `Error while creating identifier: ${JSON.stringify(
          onboardedResult.error,
          null,
          2
        )}`
      );
    }

    return identifier;
  }

  async importKey(args: {
    privateKeyHex?: string;
    keyType?: IEbsiDidSupportedKeyTypes;
    id?: Uint8Array | string;
  }): Promise<IImportedKey> {
    let jwkThumbprint: string;
    let privateKeyJwk: jose.JWK;
    let { privateKeyHex } = args;
    let publicKeyJwk: jose.JWK;
    let subjectIdentifier: string;
    const keyType: IEbsiDidSupportedKeyTypes = args.keyType || 'Secp256k1';
    let crv: string;
    const algorithm: IEbsiDidSupportedEcdsaAlgo = algoMap[keyType];
    if (!algorithm) {
      throw new Error(
        `Unsupported key type, currently only supported Secp256k1 and P-256`
      );
    }
    let curve: EC;
    switch (keyType) {
      case 'Secp256k1':
        curve = new EC('secp256k1');
        crv = 'secp256k1';
        break;
      case 'P-256':
        curve = new EC('p256');
        crv = 'P-256';
        break;
      default:
        throw new Error(
          `Unsupported key type, currently only supported Secp256k1 and P-256`
        );
    }

    if (args.privateKeyHex) {
      // Import existing custom private key along with the subject identifier
      const privateKey = curve.keyFromPrivate(args.privateKeyHex, 'hex');
      const y = bytesToBase64url(
        hexToBytes(privateKey.getPublic().getY().toString('hex'))
      );
      const x = bytesToBase64url(
        hexToBytes(privateKey.getPublic().getX().toString('hex'))
      );
      const d = bytesToBase64url(hexToBytes(args.privateKeyHex));
      privateKeyJwk = {
        kty: 'EC',
        crv,
        d,
        x,
        y,
      };
      publicKeyJwk = { ...privateKeyJwk };
      delete publicKeyJwk.d;
      jwkThumbprint = await jose.calculateJwkThumbprint(
        privateKeyJwk,
        'sha256'
      );
      subjectIdentifier = generateEbsiSubjectIdentifier(args.id);
    } else {
      // Generate new key pair
      const keys = await jose.generateKeyPair(algorithm);
      privateKeyJwk = await jose.exportJWK(keys.privateKey);
      publicKeyJwk = await jose.exportJWK(keys.publicKey);
      jwkThumbprint = await jose.calculateJwkThumbprint(
        privateKeyJwk,
        'sha256'
      );
      subjectIdentifier = generateRandomEbsiSubjectIdentifier();
      privateKeyHex = privateKeyJwkToHex(privateKeyJwk);
    }
    return {
      jwkThumbprint,
      privateKeyJwk,
      publicKeyJwk,
      subjectIdentifier,
      privateKeyHex,
    } as IImportedKey;
  }

  async updateIdentifier(
    // eslint-disable-next-line unused-imports/no-unused-vars
    args: {
      did: string;
      kms?: string | undefined;
      alias?: string | undefined;
      options?: any;
    },
    // eslint-disable-next-line unused-imports/no-unused-vars
    context: IAgentContext<IKeyManager>
  ): Promise<IIdentifier> {
    throw new Error('KeyDIDProvider updateIdentifier not supported yet.');
  }

  async deleteIdentifier(
    identifier: IIdentifier,
    context: IContext
  ): Promise<boolean> {
    // eslint-disable-next-line no-restricted-syntax
    for (const { kid } of identifier.keys) {
      // eslint-disable-next-line no-await-in-loop
      await context.agent.keyManagerDelete({ kid });
    }
    return true;
  }

  async addKey(
    {
      identifier,
      key,
      options,
    }: { identifier: IIdentifier; key: IKey; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider addKey not supported');
  }

  async addService(
    {
      identifier,
      service,
      options,
    }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider addService not supported');
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider removeKey not supported');
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider removeService not supported');
  }
}
