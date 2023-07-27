import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import {
  Component,
  copyable,
  divider,
  heading,
  panel,
  spinner,
  text,
} from '@metamask/snaps-ui';
import { W3CVerifiableCredential } from '@veramo/core';

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

  static async snapAlert(content: Component, force?: boolean): Promise<void> {
    const state = StorageService.get();

    const { disablePopups, friendlyDapps } = state.snapConfig.dApp;

    // Show popups if force is true or if popups are not disabled AND the dApp is not friendly
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
}

export const querySpinnerContent = () =>
  panel([heading('Gathering Credentials...'), spinner()]);

export const queryAllContent = (vcs: QueryVCsRequestResult[]) =>
  panel([
    heading('Share Verifiable Credentials'),
    text(
      'Would you like to share some/all Verifiable Credentials with this dApp?'
    ),
    divider(),
    text(`**Total number of VCs is ${vcs.length.toString()}**`),
    divider(),
    text(
      `You can disable this popup from appearing again in Masca Settings on Masca.io.`
    ),
  ]);

export const saveCredentialContent = (
  store: string | string[],
  verifiableCredential: any
) =>
  panel([
    heading('Save Verifiable Credential'),
    text('Would you like to save the following Verifiable Credential?'),
    divider(),
    text(`Credential:`),
    copyable(JSON.stringify(verifiableCredential, null, 2)),
    text(
      `Credential will be saved in following store(s): ${
        typeof store === 'string' ? store : store.join(', ')
      }`
    ),
  ]);

export const createCredentialContent = (
  save: boolean | undefined,
  storeString: string,
  minimalUnsignedCredential: any
) =>
  panel([
    heading('Create Credential'),
    text(
      `Would you like to ${
        save === true ? 'Sign and Save' : 'Sign'
      } the following Credential?`
    ),
    divider(),
    text(storeString),
    text(`VC:`),
    copyable(JSON.stringify(minimalUnsignedCredential, null, 2)),
  ]);

export const deleteCredentialContent = (
  store: string | string[],
  vcs: QueryVCsRequestResult[]
) =>
  panel([
    heading('Delete VC'),
    text('Are you sure you want to delete this VC?'),
    divider(),
    text(`Store: ${typeof store === 'string' ? store : store.join(', ')}`),
    text(`VCs: ${JSON.stringify(vcs, null, 2)}`),
  ]);

export const createPresentationContent = (vcs: W3CVerifiableCredential[]) =>
  panel([
    heading('Create VP'),
    text('Would you like to create a VP from the following VC(s)?'),
    divider(),
    text(`VC(s):`),
    ...vcs.map((vc) => copyable(JSON.stringify(vc, null, 2))),
  ]);

export default UIService;
