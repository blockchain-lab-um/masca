'use client';

import { isError } from '@blockchain-lab-um/masca-connector';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';

interface GoogleDriveButtonProps {
  buttonText: string;
  action: 'import' | 'backup' | 'delete';
  variant?: 'primary' | 'cancel-red';
}
const GoogleDriveButton = ({
  buttonText,
  action,
  variant = 'primary',
}: GoogleDriveButtonProps) => {
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
    try {
      if (!api) return;
      setLoading(true);
      const exportResult = await api.exportStateBackup();

      if (isError(exportResult)) {
        console.error(exportResult);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('export-error'),
            type: 'error',
            loading: false,
          });
        }, 200);
        setLoading(false);
        return;
      }

      const walletId = await api.getWalletId();
      if (isError(walletId)) {
        console.error(walletId);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('wallet-error'),
            type: 'error',
            loading: false,
          });
        }, 200);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            accessToken,
            action: 'backup',
            content: exportResult.data,
            wallet: walletId.data,
          },
        }),
      });

      if (response.status !== 200) {
        const res = await response.json();
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: res.error_description,
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
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: (error as Error).message ?? t('unknown-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
    }
  };

  const handleImport = async (accessToken: string) => {
    try {
      if (!api) return;
      setLoading(true);

      const walletId = await api.getWalletId();
      if (isError(walletId)) {
        console.error(walletId);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('wallet-error'),
            type: 'error',
            loading: false,
          });
        }, 200);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            accessToken,
            action: 'import',
            wallet: walletId.data,
          },
        }),
      });

      const res = await response.json();
      if (res.error_description) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: res.error_description,
            type: 'error',
            loading: false,
          });
        }, 200);
        setLoading(false);
        return;
      }

      const importResult = await api.importStateBackup({
        serializedState: res.content,
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
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('import-success'),
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: (error as Error).message ?? t('unknown-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
    }
  };

  const handleDelete = async (accessToken: string) => {
    try {
      if (!api) return;
      setLoading(true);

      const walletId = await api.getWalletId();
      if (isError(walletId)) {
        console.error(walletId);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('wallet-error'),
            type: 'error',
            loading: false,
          });
        }, 200);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            accessToken,
            action: 'delete',
            wallet: walletId.data,
          },
        }),
      });

      if (response.status !== 200) {
        const res = await response.json();
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: res.error_description,
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
          title: t('delete-success'),
          type: 'success',
          loading: false,
        });
      }, 200);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: (error as Error).message ?? t('unknown-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      setLoading(false);
    }
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
      console.error(error);
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
      console.error(error);
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
      <Button variant={variant} size="sm" onClick={login} loading={loading}>
        {buttonText}
      </Button>
    </div>
  );
};

export default GoogleDriveButton;
