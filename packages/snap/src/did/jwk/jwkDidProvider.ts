/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
import {
  IIdentifier,
  IKey,
  IService,
  IAgentContext,
  IKeyManager,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { base64 } from 'multiformats/bases/base64';
import { addMulticodecPrefix } from '../../utils/formatUtils';

type IContext = IAgentContext<IKeyManager>;

/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:jwk` identifiers
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class JwkDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string;

  constructor(options: { defaultKms: string }) {
    super();
    this.defaultKms = options.defaultKms;
  }

  async createIdentifier(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { kms, options }: { kms?: string; options?: any },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const key = await context.agent.keyManagerCreate({
      kms: kms || this.defaultKms,
      type: 'Ed25519',
    });

    // TODO: change did createion for jwk
    const methodSpecificId = Buffer.from(
      base64.encode(
        addMulticodecPrefix('ed25519-pub', Buffer.from(key.publicKeyHex, 'hex'))
      )
    ).toString();

    const identifier: Omit<IIdentifier, 'provider'> = {
      did: 'did:jwk:' + methodSpecificId,
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
    throw new Error('JwkDIDProvider updateIdentifier not supported yet.');
  }

  async deleteIdentifier(
    identifier: IIdentifier,
    context: IContext
  ): Promise<boolean> {
    for (const { kid } of identifier.keys) {
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
    throw Error('JwkDIDProvider addKey not supported');
  }

  async addService(
    {
      identifier,
      service,
      options,
    }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('JwkDIDProvider addService not supported');
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('JwkDIDProvider removeKey not supported');
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('JwkDIDProvider removeService not supported');
  }
}
