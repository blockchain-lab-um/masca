import type {
  IAgentContext,
  ICredentialIssuer,
  IKeyManager,
  IResolver,
} from '@veramo/core';

export type IContext = IAgentContext<
  IKeyManager & ICredentialIssuer & IResolver
>;

export type IPluginTemplateCreateIdentifierOptions = {
  /**
   * Custom private key to import, if not provided a new key will be generated
   * i.e. 2658053a899091ceb000e0f13d0a47790397e0ebc84e2b6a90489430cb6b9e06
   */
  privateKeyHex?: string;
  /**
   * Imported key type, must be passed along with private key
   */
  keyType?: IPluginTemplateDidSupportedKeyTypes;
  /**
   * Hash type used for generating keys, currently supported only sha256
   */
  hashType?: IPluginTemplateDidSupportedHashTypes;
};

export type IPluginTemplateDidSupportedKeyTypes =
  | 'Secp256k1'
  | 'Ed25519'
  | 'Secp256r1'
  | 'X25519';
export type IPluginTemplateDidSupportedHashTypes = 'sha256';
export type IPluginTemplateDidSupportedEcdsaAlgo = 'ES256' | 'ES256K';
