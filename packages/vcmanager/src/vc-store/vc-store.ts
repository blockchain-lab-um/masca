/* eslint-disable @typescript-eslint/require-await */
import { VerifiableCredential } from '@veramo/core';
import { AbstractVCStore } from './abstract-vc-store';

export class MemoryVCStore extends AbstractVCStore {
  private vcs: Record<string, VerifiableCredential> = {};

  async get({ id }: { id: string }): Promise<VerifiableCredential | null> {
    const vc = this.vcs[id];
    if (!vc) return null;
    return vc;
  }

  async delete({ id }: { id: string }) {
    delete this.vcs[id];
    return true;
  }

  async import(args: VerifiableCredential) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.vcs[args.kid] = { ...args };
    return true;
  }

  async list(): Promise<VerifiableCredential[]> {
    const safeVCs = Object.values(this.vcs).map((key) => {
      const safeVC = key;
      return safeVC;
    });
    return safeVCs;
  }
}
