/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */

import { util } from '@cef-ebsi/key-did-resolver';
import {
  IAgentContext,
  IIdentifier,
  IKey,
  IKeyManager,
  IService,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import { ec as EC } from 'elliptic';
import { base58btc } from 'multiformats/bases/base58';

import { addMulticodecPrefix } from '../../utils/formatUtils';
import { IKeyCreateIdentifierOptionsany } from './types/keyProviderTypes';

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
    {
      kms,
      options,
    }: { kms?: string; options?: IKeyCreateIdentifierOptionsany },
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
    const key = await context.agent.keyManagerCreate({
      kms: kms || this.defaultKms,
      type: 'Ed25519',
    });
    const methodSpecificId = Buffer.from(
      base58btc.encode(
        addMulticodecPrefix('ed25519-pub', Buffer.from(key.publicKeyHex, 'hex'))
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
