import type {
  IAgentContext,
  IIdentifier,
  IKey,
  IKeyManager,
  IService,
  RequireOnly,
} from '@veramo/core';
import { AbstractIdentifierProvider } from '@veramo/did-manager';

import type {
  IContext,
  IPluginTemplateCreateIdentifierOptions,
} from './types/pluginTemplateProviderTypes.js';

/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:pluginTemplate` identifiers
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class PluginTemplateDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string;

  constructor(options: { defaultKms: string }) {
    super();
    this.defaultKms = options.defaultKms;
  }

  async createIdentifier(
    {
      kms,
      options,
    }: { kms?: string; options?: IPluginTemplateCreateIdentifierOptions },
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const did = '';
    const kid = '';
    const key = {} as IKey;
    const identifier = {
      did,
      controllerKeyId: kid,
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
    throw new Error(
      'PluginTemplateDIDProvider updateIdentifier not supported yet.'
    );
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
    throw Error('PluginTemplateDIDProvider addKey not supported');
  }

  async addService(
    {
      identifier,
      service,
      options,
    }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('PluginTemplateDIDProvider addService not supported');
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('PluginTemplateDIDProvider removeKey not supported');
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IContext
  ): Promise<any> {
    throw Error('PluginTemplateDIDProvider removeService not supported');
  }

  private async importOrGenerateKey(
    args: {
      kms: string;
      options: RequireOnly<IPluginTemplateCreateIdentifierOptions, 'keyType'>;
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
