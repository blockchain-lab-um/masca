'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';

import { isError } from '@blockchain-lab-um/masca-connector';
import { useState } from 'react';
import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';

interface GoogleDriveButtonProps {
  buttonText: string;
  action: 'import' | 'backup' | 'delete';
}

const GoogleDriveButton = ({ buttonText, action }: GoogleDriveButtonProps) => {
  const t = useTranslations('SettingsCard');
  const {
    api,
    changeAvailableCredentialStores,
    changeAvailableMethods,
    changeCurrMethod,
    changeDID,
    changePopups,
  } = useMascaStore((state) => ({
    api: state.mascaApi,
    changeAvailableCredentialStores: state.changeAvailableCredentialStores,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
    changeDID: state.changeCurrDID,
    changePopups: state.changePopups,
  }));
  const [loading, setLoading] = useState(false);

  const handleExport = async (accessToken: string) => {
    if (!api) return;
    setLoading(true);
    const exportResult = await api.exportStateBackup();
    
    if (isError(exportResult)) {
      console.log(exportResult);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('export-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    const response = await fetch(`/api/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          accessToken,
          action: 'backup',
          content: exportResult.data,
        },
      }),
    });
    const res = await response.json();

    setLoading(false);
  };

  const handleImport = async (accessToken: string) => {
    setLoading(true);
    const response = await fetch(`/api/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          accessToken,
          action: 'import',
        },
      }),
    });

    const state = await response.text();
    
    if (!api) return;
    if (!state) return;
    const importResult = await api.importStateBackup({
      serializedState: state,
    });

    if (isError(importResult)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('import-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('import-success'),
        type: 'success',
        loading: false,
      });
    }, 200);

    const did = await api.getDID();
    if (isError(did)) {
      console.log("Couldn't get DID");
      throw new Error(did.error);
    }

    const availableMethods = await api.getAvailableMethods();
    if (isError(availableMethods)) {
      console.log("Couldn't get available methods");
      throw new Error(availableMethods.error);
    }

    const method = await api.getSelectedMethod();
    if (isError(method)) {
      console.log("Couldn't get selected method");
      throw new Error(method.error);
    }

    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log("Couldn't get account settings");
      throw new Error(accountSettings.error);
    }

    const snapSettings = await api.getSnapSettings();
    if (isError(snapSettings)) {
      console.log("Couldn't get snap settings");
      throw new Error(snapSettings.error);
    }

    changeDID(did.data);
    changeAvailableMethods(availableMethods.data);
    changeCurrMethod(method.data);
    changeAvailableCredentialStores(accountSettings.data.ssi.storesEnabled);
    changePopups(snapSettings.data.dApp.disablePopups);
    setLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!api) return;
      if (action === 'backup') {
        await handleExport(tokenResponse.access_token);
      }

      if(action === 'import') {
        await handleImport(tokenResponse.access_token);
      }
    },
    onError: (error) => console.log(error),
    scope:
      process.env.NEXT_PUBLIC_GOOGLE_SCOPES ?? 'https://www.googleapis.com/auth/drive.file',
  });
  return (
    <div>
      <Button variant="primary" size="sm" onClick={login} loading={loading}>
        {buttonText}
      </Button>
    </div>
  );
};

export default GoogleDriveButton;
