import { IPluginMethodMap } from '@veramo/core';

export interface IOIDCPlugin extends IPluginMethodMap {
  createAuthorizationRequest(): Promise<string>;
}
