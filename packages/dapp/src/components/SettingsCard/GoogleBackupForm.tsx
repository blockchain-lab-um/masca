import React, { useEffect } from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { GoogleOAuthProvider } from '@react-oauth/google';

import GoogleLogin from '@/components/GoogleLogin';
import { useMascaStore } from '@/stores/snapStore';
import { useToastStore } from '@/stores/toastStore';
import Button from '../Button';

export const GoogleBackupForm = () => {
  const {
    api,
    availableCredentialStores,
    popups,
    changeAvailableCredentialStores,
    changeAvailableMethods,
    changeCurrMethod,
    changeDID,
    changePopups,
    isSignedInGoogle,
    changeIsSignedInGooge,
  } = useMascaStore((state) => ({
    api: state.mascaApi,
    availableCredentialStores: state.availableCredentialStores,
    popups: state.popups,
    changeAvailableCredentialStores: state.changeAvailableCredentialStores,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
    changeDID: state.changeCurrDID,
    changePopups: state.changePopups,
    isSignedInGoogle: state.isSignedInGoogle,
    changeIsSignedInGooge: state.changeIsSignedInGoogle,
  }));

  useEffect(() => {
    if (!api) return;
    const validateGoogleSession = async () => {
      console.log('VErifyGS');
      const isSignedIn = await api.validateStoredGoogleSession();
      if (isError(isSignedIn)) {
        return;
      }
      console.log('VErifyGS', isSignedIn.data);
      changeIsSignedInGooge(isSignedIn.data);
    };
    validateGoogleSession()
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleBackup = async () => {
    if (!api) return;
    const exportResult = await api.createGoogleBackup();

    if (isError(exportResult)) {
      console.log(exportResult);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Succesfully saved to Google Drive',
        type: 'success',
        loading: false,
      });
    }, 200);
  };

  const handleImport = async () => {
    if (!api) return;
    const importResult = await api.importGoogleBackup();

    if (isError(importResult)) {
      console.log(importResult);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Succesfully imported from Google Drive',
        type: 'success',
        loading: false,
      });
    }, 200);
  };

  return (
    <div>
      {isSignedInGoogle ? (
        <div>
          <Button onClick={handleBackup} variant="primary" size="xs">
            Save to Google Drive
          </Button>
          <Button onClick={handleImport} variant="primary" size="xs">
            Import from Google Drive
          </Button>
        </div>
      ) : (
        <GoogleOAuthProvider clientId="674920268962-kdvft0dm2i9tq1nd7aeipkkea2ue4575.apps.googleusercontent.com">
          <GoogleLogin />
        </GoogleOAuthProvider>
      )}
    </div>
  );
};
