'use client';

import Link from 'next/link';
import { isError } from '@blockchain-lab-um/masca-connector';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';

import ToggleSwitch from '@/components/Switch';
import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';
import InfoIcon from '../InfoIcon';
import UploadButton from '../UploadButton';
import { FriendlydAppTable } from './FriendlydAppTable';
import GoogleBackupForm from './GoogleBackupForm';

const SettingsCard = () => {
  const t = useTranslations('SettingsCard');
  const {
    api,
    availableCredentialStores,
    popups,
    changeAvailableCredentialStores,
    changeAvailableMethods,
    changeCurrMethod,
    changeDID,
    changePopups,
  } = useMascaStore((state) => ({
    api: state.mascaApi,
    availableCredentialStores: state.availableCredentialStores,
    popups: state.popups,
    changeAvailableCredentialStores: state.changeAvailableCredentialStores,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
    changeDID: state.changeCurrDID,
    changePopups: state.changePopups,
  }));

  const snapGetAvailableCredentialStores = async () => {
    if (!api) return;
    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log('Error getting account settings', accountSettings);
      return;
    }
    changeAvailableCredentialStores(accountSettings.data.ssi.storesEnabled);
  };

  const snapChangeAvailableCredentialStores = async (
    store: 'ceramic' | 'snap',
    value: boolean
  ) => {
    if (!api) return;
    const res = await api.setCredentialStore(store, value);
    await snapGetAvailableCredentialStores();
    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('ceramic-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('ceramic-success'),
        type: 'success',
        loading: false,
        link: null,
      });
    }, 200);
  };

  const snapTogglePopups = async (enabled: boolean) => {
    if (!api) return;
    const res = await api.togglePopups();
    if (isError(res)) {
      return;
    }
    changePopups(res.data);
  };

  const handleCeramicToggle = async (enabled: boolean) => {
    await snapChangeAvailableCredentialStores('ceramic', enabled);
  };

  const handleExport = async () => {
    if (!api) return;
    const exportResult = await api.exportStateBackup();

    if (isError(exportResult)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('export-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    // Create text blob
    const blob = new Blob([exportResult.data], {
      type: 'text/plain;charset=utf-8',
    });

    // Save with file-saver
    saveAs(blob, 'masca-backup.txt');
  };

  const handleImport = async (file: File) => {
    // Read file
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    // On load
    reader.onload = async (event) => {
      if (!api) return;
      if (!event.target) return;
      const importResult = await api.importStateBackup({
        serializedState: event.target.result as string,
      });

      if (isError(importResult)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('import-error'),
            type: 'error',
            loading: false,
            link: null,
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
          link: null,
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
    };
  };

  return (
    <div className="p-6">
      <div className="flex w-full justify-between">
        <Link href="/app" className="flex items-center">
          <button className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full text-gray-800 hover:bg-pink-100 hover:text-pink-700">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </Link>
        <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-800">
          {t('title')}
        </div>
      </div>

      <div className="mt-8">
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800">
          {t('data-store')}
        </div>
        <div className="mt-4">
          <p className="text-md dark:text-navy-blue-400 text-gray-700">
            {t('data-store-desc')}{' '}
          </p>
        </div>

        <span className="dark:text-navy-blue-200 mt-8 flex justify-between text-gray-700">
          Ceramic{' '}
          <ToggleSwitch
            size="sm"
            enabled={availableCredentialStores.ceramic}
            setEnabled={handleCeramicToggle}
            shadow="md"
          />
        </span>
      </div>

      <div className="mt-12">
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800">
          {t('popups')}
        </div>
        <div className="mt-4">
          <FriendlydAppTable />
          <span className="dark:text-navy-blue-200 mt-12 flex justify-between text-gray-700">
            <div className="flex">
              <span className="mr-1 text-red-500">{t('disable-popups')}</span>
              <InfoIcon content={t('popups-desc')} />
            </div>
            <ToggleSwitch
              size="sm"
              enabled={popups!}
              setEnabled={snapTogglePopups}
              shadow="md"
            />
          </span>
        </div>
      </div>

      <div className="mt-12">
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800">
          {t('backup')}
        </div>
        <div className="mt-2">
          <p className="text-md dark:text-navy-blue-400 text-gray-700">
            {t('backup-google-desc')}{' '}
          </p>
          <div>
            <GoogleBackupForm />
          </div>
        </div>
        <div className="mt-8">
          <p className="text-md dark:text-navy-blue-400 text-gray-700">
            {t('backup-manual-desc')}{' '}
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleExport} variant="primary" size="sm">
            {t('export')}
          </Button>
          <UploadButton handleUpload={handleImport} acceptedMedia=".txt" />
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
