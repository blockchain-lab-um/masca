import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import { VCQuery } from "./interfaces";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi { }

export interface SSISnapApi {
    queryVCs(query?: VCQuery): Promise<VerifiableCredential[]>;
    saveVC(verifiableCredential: VerifiableCredential): Promise<boolean>;
    createVP(
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
