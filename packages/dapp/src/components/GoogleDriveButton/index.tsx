'use client';

import { useState } from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';

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
    if (res.error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: res.error,
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('export-success'),
        type: 'success',
        loading: false,
      });
    }, 200);

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

    const res = await response.json();
    if (res.error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: res.error,
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
      return;
    }

    if (!api) return;
    const importResult = await api.importStateBackup({
      serializedState: res.data,
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
      setLoading(false);
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

  const handleDelete = async (accessToken: string) => {
    setLoading(true);
    const response = await fetch(`/api/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          accessToken,
          action: 'delete',
        },
      }),
    });

    const res = await response.json();
    console.log('🚀 ~ file: index.tsx:179 ~ handleDelete ~ res:', res);

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('delete-success'),
        type: 'success',
        loading: false,
      });
    }, 200);

    setLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!api) return;
      switch (action) {
        case 'backup':
          await handleExport(tokenResponse.access_token);
          break;
        case 'import':
          await handleImport(tokenResponse.access_token);
          break;
        case 'delete':
          await handleDelete(tokenResponse.access_token);
          break;
        default:
          break;
      }
    },
    onError: (error) => {
      console.log(error);
      let errorMessage = error.error?.replace(/_/g, ' ');
      if (!errorMessage) errorMessage = 'Unknown error';
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: errorMessage,
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
    },
    onNonOAuthError: (error) => {
      console.log(error);
      let errorMessage = error.type.replace(/_/g, ' ');
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: errorMessage,
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
    },
    scope:
      process.env.NEXT_PUBLIC_GOOGLE_SCOPES ??
      'https://www.googleapis.com/auth/drive.appdata',
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
