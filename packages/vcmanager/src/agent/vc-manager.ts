import { IAgentPlugin } from '@veramo/core';
import {
  IVCManager,
  IVCManagerDeleteArgs,
  IVCManagerGetArgs,
  IVCManagerSaveArgs,
  IVCManagerGetResult,
  IVCManagerListResult,
  IVCManagerListArgs,
} from '../types/IVCManager';
import { AbstractVCStore } from '../vc-store/abstract-vc-store';
import { isSubset } from '../util/subset';

/**
 * {@inheritDoc IVCManager}
 * @beta
 */

export class VCManager implements IAgentPlugin {
  readonly methods: IVCManager = {
    getVC: this.getVC.bind(this),
    deleteVC: this.deleteVC.bind(this),
    listVCS: this.listVCS.bind(this),
    saveVC: this.saveVC.bind(this),
  };

  private storePlugins: Record<string, AbstractVCStore>;

  constructor(options: { store: Record<string, AbstractVCStore> }) {
    this.storePlugins = options.store;
  }

  public async getVC(args: IVCManagerGetArgs): Promise<IVCManagerGetResult> {
    if (!this.storePlugins[args.store]) throw new Error('Store not found');
    const vc = await this.storePlugins[args.store].get({ id: args.id });
    return { vc: vc };
  }
  public async saveVC(args: IVCManagerSaveArgs): Promise<boolean> {
    if (!this.storePlugins[args.store]) throw new Error('Store not found');
    const res = await this.storePlugins[args.store].import(args.vc);
    return res;
  }
  public async deleteVC(args: IVCManagerDeleteArgs): Promise<boolean> {
    if (!this.storePlugins[args.store]) throw new Error('Store not found');
    const res = await this.storePlugins[args.store].delete({ id: args.id });
    return res;
  }
  public async listVCS(
    args: IVCManagerListArgs
  ): Promise<IVCManagerListResult> {
    if (!this.storePlugins[args.store]) throw new Error('Store not found');
    let vcs = await this.storePlugins[args.store].list();
    if (args.query) {
      vcs = vcs.filter((i) => {
        return isSubset(i, args.query as object);
      });
    }
    return { vcs: vcs };
  }
}
