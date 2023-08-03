import {
  createJWK,
  encodePublicKey,
  getCompressedPublicKey,
} from '@blockchain-lab-um/utils';
import { util } from '@cef-ebsi/key-did-resolver';
import type {
  IAgentContext,
  IIdentifier,
  IKey,
  IKeyManager,
  IService,
  ManagedKeyInfo,
  RequireOnly,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';

import {
  isSupportedKeyType,
  KEY_TYPE_TO_MULTICODEC_NAME,
  type ICreateKeyDidOptions,
} from './types/keyDidTypes.js';

type IContext = IAgentContext<IKeyManager>;

/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:key` identifiers
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class KeyDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string;

  constructor(options: { defaultKms: string }) {
    super();
    this.defaultKms = options.defaultKms;
  }

  async createIdentifier(
    { kms, options }: { kms?: string; options?: ICreateKeyDidOptions },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const keyType =
      options?.keyType && isSupportedKeyType(options.keyType)
        ? options.keyType
        : 'Ed25519';

    const key: ManagedKeyInfo = await this.importOrGenerateKey(
      {
        kms: kms ?? this.defaultKms,
        options: {
          keyType,
          ...(options?.privateKeyHex && {
            privateKeyHex: options.privateKeyHex,
          }),
        },
      },
      context
    );

    console.log(key);

    if (options?.type === 'ebsi') {
      const compressedKey =
        keyType === 'Secp256k1'
          ? getCompressedPublicKey(`0x${key.publicKeyHex}`)
          : key.publicKeyHex;

      const jwk = createJWK(keyType, compressedKey);

      const did = util.createDid(jwk);
      const identifier: Omit<IIdentifier, 'provider'> = {
        did,
        controllerKeyId: key.kid,
        keys: [key],
        services: [],
      };

      return identifier;
    }

    const compressedKey =
      keyType === 'Secp256k1'
        ? getCompressedPublicKey(`0x${key.publicKeyHex}`)
        : key.publicKeyHex;

    const methodSpecificId = encodePublicKey(
      Buffer.from(compressedKey, 'hex'),
      KEY_TYPE_TO_MULTICODEC_NAME[keyType]
    );

    const identifier: Omit<IIdentifier, 'provider'> = {
      did: `did:key:${methodSpecificId}`,
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    };

    return identifier;
  }

  async updateIdentifier(
    _args: {
      did: string;
      kms?: string;
      alias?: string | undefined;
      options?: any;
    },
    _context: IAgentContext<IKeyManager>
  ): Promise<IIdentifier> {
    throw new Error('KeyDIDProvider updateIdentifier not supported yet.');
  }

  async deleteIdentifier(
    identifier: IIdentifier,
    context: IContext
  ): Promise<boolean> {
    for (const { kid } of identifier.keys) {
      // eslint-disable-next-line no-await-in-loop
      await context.agent.keyManagerDelete({ kid });
    }
    return true;
  }

  async addKey(
    _args: { identifier: IIdentifier; key: IKey; options?: any },
    _context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider addKey not supported');
  }

  async addService(
    _args: { identifier: IIdentifier; service: IService; options?: any },
    _context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider addService not supported');
  }

  async removeKey(
    _args: { identifier: IIdentifier; kid: string; options?: any },
    _context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider removeKey not supported');
  }

  async removeService(
    _args: { identifier: IIdentifier; id: string; options?: any },
    _context: IContext
  ): Promise<any> {
    throw Error('KeyDIDProvider removeService not supported');
  }

  private async importOrGenerateKey(
    args: {
      kms: string;
      options: RequireOnly<ICreateKeyDidOptions, 'keyType'>;
    },
    context: IContext
  ): Promise<IKey> {
    if (args.options.privateKeyHex) {
      return context.agent.keyManagerImport({
        kms: args.kms || this.defaultKms,
        type: args.options.keyType,
        privateKeyHex: args.options.privateKeyHex,
      });
    }
    return context.agent.keyManagerCreate({
      kms: args.kms || this.defaultKms,
      type: args.options.keyType,
    });
  }
}
