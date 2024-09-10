import type { JSONObject } from '@0xpolygonid/js-sdk';
import {
  CURRENT_STATE_VERSION,
  type JWTHeader,
  type JWTPayload,
  type MascaRPCRequest,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-types';

import StorageService from './storage/Storage.service';
import { getInitialPermissions } from './utils/config';
import {
  getPermissions,
  isPermitted,
  isTrustedDapp,
  permissionExists,
} from './utils/permissions';

import {
  Box,
  Divider,
  Heading,
  Text,
  Bold,
  Copyable,
  Italic,
  Link,
  type JSXElement,
} from '@metamask/snaps-sdk/jsx';
import type { W3CVerifiableCredential } from '@veramo/core';

const permissionActions: Record<string, string> = {
  queryCredentials: 'Querying Credentials',
};

const permissionExtraText: Record<string, string> = {
  queryCredentials:
    'You will no longer see a popup on this dApp when credentials are requested!',
};

class UIService {
  static originHostname: string;

  static originWrapper: JSXElement[];

  static async init(origin: string) {
    UIService.originHostname = new URL(origin).hostname; // hostname
    UIService.originWrapper = [
      <Box key={'originWrapperBox'}>
        <Text>
          Origin: <Bold>{UIService.originHostname}</Bold>
        </Text>
        <Divider />
      </Box>,
    ];
  }

  static async snapConfirm(params: {
    method: MascaRPCRequest['method'] | 'other';
    content: JSXElement;
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
          content: content,
        },
      });

      return res as boolean;
    }
    return true;
  }

  static async snapAlert(params: {
    content: JSXElement;
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
          content: content,
        },
      });
    }
  }

  static async queryAllDialog(): Promise<boolean> {
    const uiPanelContent = (
      <Box>
        <Heading>Share Verifiable Credentials</Heading>
        {...UIService.originWrapper}
        <Text>
          Would you like give <Bold>{UIService.originHostname}</Bold> permission
          to access your credentials?
        </Text>
        <Divider />
        <Text>
          This permission can be revoked at{' '}
          <Link href="https://masca.io">Masca dApp</Link>.
        </Text>
      </Box>
    );

    const state = StorageService.get();

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
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

    const uiPanelContent = (
      <Box>
        <Heading>Save Verifiable Credential</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to save the credential below?</Text>
        <Divider />
        <Text>
          Credential will be saved in the following data store(s):{' '}
          <Italic>
            {typeof store === 'string' ? store : store.join(', ')}
          </Italic>
        </Text>
        <Divider />
        <Text>Credential:</Text>
        <Copyable value={JSON.stringify(verifiableCredential, null, 2)} />
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
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

    const uiPanelContent = (
      <Box>
        <Heading>Create and Save Verifiable Credential</Heading>
        {...UIService.originWrapper}
        <Text>
          DID: <Italic>{did}</Italic>
        </Text>
        <Divider />
        <Text>
          Would you like to {save === true ? 'sign and save' : 'sign'} the
          credential below?
        </Text>
        <Divider />
        <Text>{storeString}</Text>
        <Text>Credential:</Text>
        <Copyable value={JSON.stringify(minimalUnsignedCredential, null, 2)} />
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
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

    const uiPanelContent = (
      <Box>
        <Heading>Delete Verifiable Credential</Heading>
        {...UIService.originWrapper}
        <Text>Are you sure you want to delete this credential?</Text>
        <Divider />
        <Text>
          Credential will be deleted from the following data store(s):{' '}
          <Italic>
            {typeof store === 'string' ? store : store.join(', ')}
          </Italic>
        </Text>
        <Divider />
        <Text>Credential: {JSON.stringify(vcs, null, 2)}</Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'deleteCredential',
    });
    return res;
  }

  static async createPresentationDialog(params: {
    vcs: W3CVerifiableCredential[];
    did: string;
  }) {
    const { vcs, did } = params;

    const uiPanelContent = (
      <Box>
        <Heading>Create Verifiable Presentation</Heading>
        {...UIService.originWrapper}
        <Text>
          DID: <Italic>{did}</Italic>
        </Text>
        <Divider />
        <Text>
          Would you like to create a presentation from the credentials below?
        </Text>
        <Divider />
        <Text>Credentials:</Text>
        {vcs.map((vc) => (
          <Copyable key={vc.toString()} value={JSON.stringify(vc, null, 2)} />
        ))}
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'createPresentation',
    });
    return res;
  }

  static async handleCredentialOfferDialog(data: any) {
    const uiPanelContent = (
      <Box>
        <Heading>Credential Offer</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to accept the Credential Offer?</Text>
        <Divider />
        <Text>Data:</Text>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'handleCredentialOffer',
      force: true,
    });
    return res;
  }

  static async handleAuthorizationRequestDialog(data: any) {
    const uiPanelContent = (
      <Box>
        <Heading>Authorization Request</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to accept the Authorization Request?</Text>
        <Divider />
        <Text>Data:</Text>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'handleAuthorizationRequest',
      force: true,
    });
    return res;
  }

  static async togglePopupsDialog() {
    const uiPanelContent = (
      <Box>
        <Heading>Toggle Popups</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to turn off popups?</Text>
        <Divider />
        <Text>
          This can result in a better user experience, but you will not be able
          to see what the dapp is requesting.
        </Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      force: true,
      method: 'togglePopups',
    });
    return res;
  }

  static async addTrustedDappDialog(origin: string) {
    const uiPanelContent = (
      <Box>
        <Heading>Disable Popups</Heading>
        {...UIService.originWrapper}
        <Text>
          Would you like to disable popups on <Bold>{origin}</Bold>?
        </Text>
        <Divider />
        <Text>
          This will disable all non-crucial popups on this dApp. This can be
          changed on <Link href="https://masca.io">Masca dApp</Link>.
        </Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      force: true,
      method: 'addTrustedDapp',
    });
    return res;
  }

  static async removeTrustedDappDialog(origin: string) {
    const uiPanelContent = (
      <Box>
        <Heading>Enable Popups</Heading>
        {...UIService.originWrapper}
        <Text>
          Would you like to re-enable popups on <Bold>{origin}</Bold>?
        </Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'removeTrustedDapp',
    });
    return res;
  }

  static async getPinDialog() {
    const uiPanelContent = (
      <Box>
        <Heading>Enter the PIN</Heading>
        {...UIService.originWrapper}
      </Box>
    );

    const pin = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'prompt',
        content: uiPanelContent,
        placeholder: 'PIN...',
      },
    });
    return pin;
  }

  static async exportBackupDialog() {
    const uiPanelContent = (
      <Box>
        <Heading>Export Backup</Heading>
        {...UIService.originWrapper}
        <Text>
          This method returns the encrypted backup of your Masca state. You can
          use this backup to restore your state on different device.
        </Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      force: true,
      method: 'exportStateBackup',
    });
    return res;
  }

  static async importBackupDialog() {
    const uiPanelContent = (
      <Box>
        <Heading>Import Backup</Heading>
        {...UIService.originWrapper}
        <Text>
          This method allows you to import an encrypted backup of your Masca
          state.
        </Text>
        <Divider />
        <Text>
          Please note that this will <Italic>overwrite</Italic> your current
          Masca state.
        </Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      force: true,
      method: 'importStateBackup',
    });
    return res;
  }

  static async signDataJWTDialog(params: {
    header: JWTHeader;
    payload: JWTPayload;
  }) {
    const uiPanelContent = (
      <Box>
        <Heading>Sign Data</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to sign the following JWT?</Text>
        <Divider />
        <Text>Header:</Text>
        <Copyable value={JSON.stringify(params.header, null, 2)} />
        <Divider />
        <Text>Payload:</Text>
        <Copyable value={JSON.stringify(params.payload, null, 2)} />
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'signData',
      force: true,
    });

    return res;
  }

  static async signDataJWZDialog(params: { data: JSONObject }) {
    const uiPanelContent = (
      <Box>
        <Heading>Sign Data</Heading>
        {...UIService.originWrapper}
        <Text>Would you like to sign the following data?</Text>
        <Copyable value={JSON.stringify(params.data, null, 2)} />
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'signData',
      force: true,
    });

    return res;
  }

  static async changePermissionDialog(params: {
    permission: string;
    value: boolean;
  }) {
    const uiPanelContent = (
      <Box>
        <Heading>Change Permission</Heading>
        {...UIService.originWrapper}
        <Text>Would you to change the following permission?</Text>
        <Divider />
        <Text>
          <Italic>{params.value ? 'Disable' : 'Enable'}</Italic> popups for{' '}
          <Italic>{permissionActions[params.permission]}</Italic> on{' '}
          <Bold>{UIService.originHostname}</Bold>.{' '}
        </Text>
        <Divider />
        <Text>{permissionExtraText[params.permission]}</Text>
      </Box>
    );

    const res = await UIService.snapConfirm({
      content: uiPanelContent,
      method: 'changePermission',
    });

    return res;
  }
}

export default UIService;
