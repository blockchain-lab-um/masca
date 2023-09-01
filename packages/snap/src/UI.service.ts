import {
  CURRENT_STATE_VERSION,
  QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-types';
import {
  Component,
  copyable,
  divider,
  heading,
  panel,
  text,
} from '@metamask/snaps-ui';
import { W3CVerifiableCredential } from '@veramo/core';

import StorageService from './storage/Storage.service';

class UIService {
  static origin: string;

  static originWrapper: Component[];

  static async init(origin: string) {
    this.origin = origin;
    this.originWrapper = [text(`Origin: **${origin}**`), divider()];
  }

  static async snapConfirm(params: {
    content: Component;
    force?: boolean;
  }): Promise<boolean> {
    const { content, force = false } = params;
    const state = StorageService.get();

    const { disablePopups, friendlyDapps } =
      state[CURRENT_STATE_VERSION].config.dApp;

    // Show popups if force is true or if popups are not disabled AND the dapp is not friendly
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

  static async snapAlert(params: {
    content: Component;
    force?: boolean;
  }): Promise<void> {
    const { content, force = false } = params;
    const state = StorageService.get();

    const { disablePopups, friendlyDapps } =
      state[CURRENT_STATE_VERSION].config.dApp;

    // Show popups if force is true or if popups are not disabled AND the dapp is not friendly
    if (force || !(disablePopups || friendlyDapps.includes(this.origin))) {
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content,
        },
      });
    }
  }

  static async queryAllDialog(params: {
    vcs: QueryCredentialsRequestResult[];
  }): Promise<boolean> {
    const { vcs } = params;
    const uiPanel = panel([
      heading('Share Verifiable Credentials'),
      ...this.originWrapper,
      text('Would you like to share Verifiable Credentials with this dapp?'),
      divider(),
      text(`**Total number of VCs is ${vcs.length.toString()}**`),
      divider(),
      text(
        `You can disable this pop-up from appearing again in Settings on Masca.io.`
      ),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async saveCredentialDialog(params: {
    store: string | string[];
    verifiableCredential: any;
  }) {
    const { store, verifiableCredential } = params;
    const uiPanel = panel([
      heading('Save Verifiable Credential'),
      ...this.originWrapper,
      text('Would you like to save the following Verifiable Credential?'),
      divider(),
      text(
        `Credential will be saved in following store(s): **${
          typeof store === 'string' ? store : store.join(', ')
        }**`
      ),
      divider(),
      text(`Credential:`),
      copyable(JSON.stringify(verifiableCredential, null, 2)),
    ]);
    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async createCredentialDialog(params: {
    save: boolean | undefined;
    storeString: string;
    minimalUnsignedCredential: any;
    did: string;
  }) {
    const { save, storeString, minimalUnsignedCredential, did } = params;
    const uiPanel = panel([
      heading('Create Credential'),
      ...this.originWrapper,
      text(`DID: **${did}**`),
      divider(),
      text(
        `Would you like to ${
          save === true ? 'Sign and Save' : 'Sign'
        } the following Credential?`
      ),
      divider(),
      text(`${storeString}`),
      text(`VC:`),
      copyable(JSON.stringify(minimalUnsignedCredential, null, 2)),
    ]);
    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async deleteCredentialDialog(params: {
    store: string | string[];
    vcs: QueryCredentialsRequestResult[];
  }) {
    const { store, vcs } = params;
    const uiPanel = panel([
      heading('Delete VC'),
      ...this.originWrapper,
      text('Are you sure you want to delete this VC?'),
      divider(),
      text(`Store: ${typeof store === 'string' ? store : store.join(', ')}`),
      text(`VCs: ${JSON.stringify(vcs, null, 2)}`),
    ]);
    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async createPresentationDialog(params: {
    vcs: W3CVerifiableCredential[];
    did: string;
  }) {
    const { vcs, did } = params;
    const uiPanel = panel([
      heading('Create VP'),
      ...this.originWrapper,
      text(`DID: **${did}**`),
      divider(),
      text('Would you like to create a VP from the following VC(s)?'),
      divider(),
      text(`VC(s):`),
      ...vcs.map((vc) => copyable(JSON.stringify(vc, null, 2))),
    ]);
    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async handleCredentialOfferDialog(data: any) {
    const uiPanel = panel([
      heading('Credential Offer'),
      ...this.originWrapper,
      text('Would you like to accept the following Credential Offer?'),
      divider(),
      text(`Data:`),
      text(JSON.stringify(data, null, 2)),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async handleAuthorizationRequestDialog(data: any) {
    const uiPanel = panel([
      heading('Authorization Request'),
      ...this.originWrapper,
      text('Would you like to accept the following Authorization Request?'),
      divider(),
      text(`Data:`),
      text(JSON.stringify(data, null, 2)),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async togglePopupsDialog() {
    const uiPanel = panel([
      heading('Toggle Pop-ups'),
      ...this.originWrapper,
      text('Would you like to turn off pop-ups?'),
      divider(),
      text(
        'This can result in a better user experience, but you will not be able to see what the dapp is requesting.'
      ),
    ]);
    const res = await UIService.snapConfirm({ content: uiPanel, force: true });
    return res;
  }

  static async addFriendlyDappDialog(origin: string) {
    const uiPanel = panel([
      heading('Add Friendly DApp'),
      ...this.originWrapper,
      text(`Would you like to add ${origin} as a friendly dapp?`),
      divider(),
      text('Pop-ups do not appear on friendly dapps.'),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel, force: true });
    return res;
  }

  static async removeFriendlyDappDialog(origin: string) {
    const uiPanel = panel([
      heading('Remove Friendly DApp'),
      ...this.originWrapper,
      text(
        `Would you like to remove ${origin} from the list of friendly dapps?`
      ),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel });
    return res;
  }

  static async getPinDialog() {
    const pin = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'prompt',
        content: panel([
          heading('Please enter the PIN you received from the issuer'),
          ...this.originWrapper,
        ]),
        placeholder: 'PIN...',
      },
    });
    return pin;
  }

  static async exportBackupDialog() {
    const uiPanel = panel([
      heading('Export Backup'),
      ...this.originWrapper,
      text(
        'This RPC method returns the encrypted backup of your Masca state. You can use this backup to restore your state on another device.'
      ),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel, force: true });
    return res;
  }

  static async importBackupDialog() {
    const uiPanel = panel([
      heading('Import Backup'),
      ...this.originWrapper,
      text(
        'This RPC method allows you to import an encrypted backup of your Masca state.'
      ),
      divider(),
      text(
        'Please note that this will **overwrite** your current Masca state.'
      ),
    ]);

    const res = await UIService.snapConfirm({ content: uiPanel, force: true });
    return res;
  }
}

export default UIService;
