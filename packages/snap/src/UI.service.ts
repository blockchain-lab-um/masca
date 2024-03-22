import type { JSONObject } from '@0xpolygonid/js-sdk';
import {
  CURRENT_STATE_VERSION,
  type JWTHeader,
  type JWTPayload,
  type MascaRPCRequest,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-types';
import {
  type Component,
  copyable,
  divider,
  heading,
  panel,
  text,
} from '@metamask/snaps-sdk';
import type { W3CVerifiableCredential } from '@veramo/core';

import StorageService from './storage/Storage.service';
import { getInitialPermissions } from './utils/config';
import {
  getPermissions,
  isPermitted,
  isTrustedDapp,
  permissionExists,
} from './utils/permissions';

const permissionActions: Record<string, string> = {
  queryCredentials: 'Querying Credentials',
};

const permissionExtraText: Record<string, string> = {
  queryCredentials:
    'You will no longer see a popup on this dApp when credentials are requested!',
};

class UIService {
  static originHostname: string;

  static originWrapper: Component[];

  static async init(origin: string) {
    UIService.originHostname = new URL(origin).hostname; // hostname
    UIService.originWrapper = [text(`Origin: **${origin}**`), divider()];
  }

  static async snapConfirm(params: {
    method: MascaRPCRequest['method'] | 'other';
    content: Component;
    force?: boolean;
  }): Promise<boolean> {
    const { content, force = false } = params;
    const state = StorageService.get();

    const { disablePopups } = state[CURRENT_STATE_VERSION].config.dApp;

    // Show popups if force is true or if popups are not disabled AND the dapp is not trusted
    if (
      force ||
      !(
        disablePopups ||
        isTrustedDapp(UIService.originHostname, state) ||
        isPermitted(UIService.originHostname, state, params.method)
      )
    ) {
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

    const { disablePopups } = state[CURRENT_STATE_VERSION].config.dApp;

    // Show popups if force is true or if popups are not disabled AND the dapp is not trusted
    if (
      force ||
      !(disablePopups || isTrustedDapp(UIService.originHostname, state))
    ) {
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content,
        },
      });
    }
  }

  static async queryAllDialog(): Promise<boolean> {
    const uiPanel = panel([
      heading('Share Verifiable Credentials'),
      ...UIService.originWrapper,
      text(
        `Would you like give _**${UIService.originHostname}**_ permission to access your credentials?`
      ),
      divider(),
      text('This permission can be revoked at [Masca dApp](https://masca.io).'),
    ]);

    const state = StorageService.get();

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'queryCredentials',
    });

    // If accepted and query permission doesnt exist, add it
    const permission = isPermitted(
      UIService.originHostname,
      state,
      'queryCredentials'
    );

    const isTrusted = isTrustedDapp(UIService.originHostname, state);

    if (res && isTrusted) return res;

    if (res && !permission) {
      let newPermissions = getInitialPermissions();

      if (permissionExists(UIService.originHostname, state)) {
        newPermissions = getPermissions(state)[UIService.originHostname];
      }
      newPermissions.methods.queryCredentials = true;

      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        UIService.originHostname
      ] = newPermissions;
    }

    return res;
  }

  static async saveCredentialDialog(params: {
    store: string | string[];
    verifiableCredential: any;
  }) {
    const { store, verifiableCredential } = params;
    const uiPanel = panel([
      heading('Save Verifiable Credential'),
      ...UIService.originWrapper,
      text('Would you like to save the credential below?'),
      divider(),
      text(
        `Credential will be saved in the following data store(s): **${
          typeof store === 'string' ? store : store.join(', ')
        }**`
      ),
      divider(),
      text('Credential:'),
      copyable(JSON.stringify(verifiableCredential, null, 2)),
    ]);
    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'saveCredential',
    });
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
      heading('Create and Save Verifiable Credential'),
      ...UIService.originWrapper,
      text(`DID: **${did}**`),
      divider(),
      text(
        `Would you like to ${
          save === true ? 'sign and save' : 'sign'
        } the credential below?`
      ),
      divider(),
      text(`${storeString}`),
      text('Credential:'),
      copyable(JSON.stringify(minimalUnsignedCredential, null, 2)),
    ]);
    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'createCredential',
      force: true,
    });
    return res;
  }

  static async deleteCredentialDialog(params: {
    store: string | string[];
    vcs: QueryCredentialsRequestResult[];
  }) {
    const { store, vcs } = params;
    const uiPanel = panel([
      heading('Delete Verifiable Credential'),
      ...UIService.originWrapper,
      text('Are you sure you want to delete this credential?'),
      divider(),
      text(
        `Credential will be deleted from the following data store(s): **${
          typeof store === 'string' ? store : store.join(', ')
        }**`
      ),
      divider(),
      text(`Credential: ${JSON.stringify(vcs, null, 2)}`),
    ]);
    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'deleteCredential',
    });
    return res;
  }

  static async createPresentationDialog(params: {
    vcs: W3CVerifiableCredential[];
    did: string;
  }) {
    const { vcs, did } = params;
    const uiPanel = panel([
      heading('Create Verifiable Presentation'),
      ...UIService.originWrapper,
      text(`DID: **${did}**`),
      divider(),
      text(
        'Would you like to create a presentation from the credentials below?'
      ),
      divider(),
      text('Credentials:'),
      ...vcs.map((vc) => copyable(JSON.stringify(vc, null, 2))),
    ]);
    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'createPresentation',
    });
    return res;
  }

  static async handleCredentialOfferDialog(data: any) {
    const uiPanel = panel([
      heading('Credential Offer'),
      ...UIService.originWrapper,
      text('Would you like to accept the Credential Offer?'),
      divider(),
      text('Data:'),
      text(JSON.stringify(data, null, 2)),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'handleCredentialOffer',
      force: true,
    });
    return res;
  }

  static async handleAuthorizationRequestDialog(data: any) {
    const uiPanel = panel([
      heading('Authorization Request'),
      ...UIService.originWrapper,
      text('Would you like to accept the Authorization Request?'),
      divider(),
      text('Data:'),
      text(JSON.stringify(data, null, 2)),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'handleAuthorizationRequest',
      force: true,
    });
    return res;
  }

  static async togglePopupsDialog() {
    const uiPanel = panel([
      heading('Toggle Popups'),
      ...UIService.originWrapper,
      text('Would you like to turn off popups?'),
      divider(),
      text(
        'This can result in a better user experience, but you will not be able to see what the dapp is requesting.'
      ),
    ]);
    const res = await UIService.snapConfirm({
      content: uiPanel,
      force: true,
      method: 'togglePopups',
    });
    return res;
  }

  static async addTrustedDappDialog(origin: string) {
    const uiPanel = panel([
      heading('Disable Popups'),
      ...UIService.originWrapper,
      text(`Would you like to disable popups on _**${origin}**_?`),
      divider(),
      text(
        'This will disable all non-crucial popups on this dApp. This can be changed on [Masca dApp](https://masca.io).'
      ),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      force: true,
      method: 'addTrustedDapp',
    });
    return res;
  }

  static async removeTrustedDappDialog(origin: string) {
    const uiPanel = panel([
      heading('Enable Popups'),
      ...UIService.originWrapper,
      text(`Would you like to re-enable popups on _**${origin}**_?`),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'removeTrustedDapp',
    });
    return res;
  }

  static async getPinDialog() {
    const pin = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'prompt',
        content: panel([
          heading('Enter the PIN you received from the issuer.'),
          ...UIService.originWrapper,
        ]),
        placeholder: 'PIN...',
      },
    });
    return pin;
  }

  static async exportBackupDialog() {
    const uiPanel = panel([
      heading('Export Backup'),
      ...UIService.originWrapper,
      text(
        'This method returns the encrypted backup of your Masca state. You can use this backup to restore your state on different device.'
      ),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      force: true,
      method: 'exportStateBackup',
    });
    return res;
  }

  static async importBackupDialog() {
    const uiPanel = panel([
      heading('Import Backup'),
      ...UIService.originWrapper,
      text(
        'This method allows you to import an encrypted backup of your Masca state.'
      ),
      divider(),
      text(
        'Please note that this will **overwrite** your current Masca state.'
      ),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      force: true,
      method: 'importStateBackup',
    });
    return res;
  }

  static async signDataJWTDialog(params: {
    header: JWTHeader;
    payload: JWTPayload;
  }) {
    const uiPanel = panel([
      heading('Sign Data'),
      ...UIService.originWrapper,
      text('Would you like to sign the following JWT?'),
      divider(),
      text('Header:'),
      copyable(JSON.stringify(params.header, null, 2)),
      divider(),
      text('Payload:'),
      copyable(JSON.stringify(params.payload, null, 2)),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'signData',
      force: true,
    });

    return res;
  }

  static async signDataJWZDialog(params: { data: JSONObject }) {
    const uiPanel = panel([
      heading('Sign Data'),
      ...UIService.originWrapper,
      text('Would you like to sign the following data?'),
      copyable(JSON.stringify(params.data, null, 2)),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'signData',
      force: true,
    });

    return res;
  }

  static async changePermissionDialog(params: {
    permission: string;
    value: boolean;
  }) {
    const uiPanel = panel([
      heading('Change Permission'),
      ...UIService.originWrapper,
      text('Would you to change the following permission?'),
      divider(),
      text(
        `**${params.value ? 'Disable' : 'Enable'}** popups for **${
          permissionActions[params.permission]
        }** on _**${UIService.originHostname}**_.`
      ),
      divider(),
      text(`${permissionExtraText[params.permission]}`),
    ]);

    const res = await UIService.snapConfirm({
      content: uiPanel,
      method: 'changePermission',
    });

    return res;
  }
}

export default UIService;
