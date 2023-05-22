/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { util } from '@cef-ebsi/key-did-resolver';
import { IAgentContext, IIdentifier, IKeyManager } from '@veramo/core';
import { KeyDIDProvider } from '@veramo/did-provider-key';
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import { ec as EC } from 'elliptic';

import type { CreateKeyDidOptions } from '../src/types/keyDidTypes.js';

type IContext = IAgentContext<IKeyManager>;

export class MascaKeyDidProvider extends KeyDIDProvider {
  private readonly kms: string;

  constructor(options: { defaultKms: string }) {
    super(options);
    this.kms = options.defaultKms;
  }

  async createIdentifier(
    {
      kms,
      options,
    }: {
      kms?: string;
      options?: CreateKeyDidOptions;
    },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    if (options?.type?.toLowerCase().includes('ebsi')) {
      const key = await context.agent.keyManagerCreate({
        kms: kms || this.kms,
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
    return super.createIdentifier({ kms, options }, context);
  }
}
