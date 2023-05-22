/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */

import {
  addMulticodecPrefix,
  getCompressedPublicKey,
} from '@blockchain-lab-um/utils';
import { util } from '@cef-ebsi/key-did-resolver';
import {
  IAgentContext,
  IIdentifier,
  IKey,
  IKeyManager,
  IService,
  RequireOnly,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import { ec as EC } from 'elliptic';
import { base58btc } from 'multiformats/bases/base58';

import { CreateKeyDidOptions, keyOptions } from './types/keyProviderTypes';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { kms, options }: { kms?: string; options?: CreateKeyDidOptions },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    if (options?.type === 'ebsi') {
      const key = await context.agent.keyManagerCreate({
        kms: kms || this.defaultKms,
        type: 'Secp256k1',
      });
      const curve = new EC('secp256k1');
      const publicKey = curve.keyFromPublic(key.publicKeyHex, 'hex');
      const y = bytesToBase64url(
        hexToBytes(publicKey.getPublic().getY().toString('hex'))
      );
      const x = bytesToBase64url(
        hexToBytes(publicKey.getPublic().getX().toString('hex'))
      );
      const jwk = {
        kty: 'EC',
        crv: 'secp256k1',
        x,
        y,
      };
      const did = util.createDid(jwk);
      const identifier: Omit<IIdentifier, 'provider'> = {
        did,
        controllerKeyId: key.kid,
        keys: [key],
        services: [],
      };
      return identifier;
    }
    const keyType =
      (options?.keyType && keyOptions[options?.keyType] && options.keyType) ||
      'Ed25519';

    const key = await this.importOrGenerateKey(
      {
        kms: kms || this.defaultKms,
        options: {
          keyType,
          ...(options?.privateKeyHex && {
            privateKeyHex: options.privateKeyHex,
          }),
        },
      },
      context
    );

    const compressedKey = getCompressedPublicKey(`0x${key.publicKeyHex}`);
    const methodSpecificId = Buffer.from(
      base58btc.encode(
        addMulticodecPrefix(
          keyOptions[keyType],
          Buffer.from(compressedKey, 'hex')
        )
      )
    ).toString();

    const identifier: Omit<IIdentifier, 'provider'> = {
      did: `did:key:${methodSpecificId}`,
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    };
    return identifier;
  }

  async updateIdentifier(
    args: {
      did: string;
      kms?: string | undefined;
      alias?: string | undefined;
      options?: any;
    },
    context: IAgentContext<IKeyManager>
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

  private async importOrGenerateKey(
    args: {
      kms: string;
      options: RequireOnly<CreateKeyDidOptions, 'keyType'>;
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
