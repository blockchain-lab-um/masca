import type { Component } from '@metamask/snaps-ui';

import StorageService from './storage/Storage.service';

class UIService {
  static origin: string;

  static async init(origin: string) {
    this.origin = origin;
  }

  static async snapConfirm(
    content: Component,
    force?: boolean
  ): Promise<boolean> {
    const state = StorageService.get();

    const { disablePopups, friendlyDapps } = state.snapConfig.dApp;

    // Show popups if force is true or if popups are not disabled AND the dApp is not friendly
    if (force || !(disablePopups || friendlyDapps.includes(this.origin))) {
      const res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content,
        },
      });
      return res as boolean;
    }
    return true;
  }
}

export default UIService;
