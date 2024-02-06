import { Result } from '@blockchain-lab-um/utils';
import {
  IAgentContext,
  ICredentialVerifier,
  IPluginMethodMap,
} from '@veramo/core';

export interface IExtendedVerificationPlugin extends IPluginMethodMap {
  // For issuance handling
  test(args: any): Promise<Result<any>>;
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 */
export type ExtendedVerificationAgentContext =
  IAgentContext<ICredentialVerifier>;
