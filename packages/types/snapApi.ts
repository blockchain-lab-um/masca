import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import { VCQuery } from './methods';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  getVCs(query?: VCQuery): Promise<VerifiableCredential[]>;
  saveVC(verifiableCredential: VerifiableCredential): Promise<boolean>;
  getVP(
    vcId: string,
    domain?: string,
    challenge?: string
  ): Promise<VerifiablePresentation>;
  changeInfuraToken(infuraToken: string): Promise<boolean>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getMethod(): Promise<string>;
  getAvailableMethods(): Promise<string[]>;
  switchMethod(didMethod: string): Promise<boolean>;
  getVCStore(): Promise<string>;
  setVCStore(vcStore: string): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
}