'use client';

import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import ToggleSwitch from '@/components/Switch';
import { useMascaStore, useToastStore } from '@/stores';

const SettingsCard = () => {
  const t = useTranslations('SettingsCard');
  const { api, availableCredentialStores, changeAvailableCredentialStores } =
    useMascaStore(
      (state) => ({
        api: state.mascaApi,
        availableCredentialStores: state.availableCredentialStores,
        changeAvailableCredentialStores: state.changeAvailableCredentialStores,
      }),
      shallow
    );

  const snapGetAvailableCredentialStores = async () => {
    if (!api) return;
    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log('Error getting account settings', accountSettings);
      return;
    }
    changeAvailableCredentialStores(accountSettings.data.ssi.vcStore);
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
      });
    }, 200);
  };

  const handleCeramicToggle = async (enabled: boolean) => {
    await snapChangeAvailableCredentialStores('ceramic', enabled);
  };

  return (
    <div className="h-full p-6 text-lg">
      <div>
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800">
          {t('data-store')}
        </div>
        <div className="mt-5">
          <p className="text-md dark:text-navy-blue-400 text-gray-700 ">
            {t('data-store-desc')}{' '}
          </p>
        </div>

        <span className="dark:text-navy-blue-200 mt-10 flex justify-between text-gray-700 ">
          Ceramic{' '}
          <ToggleSwitch
            size="md"
            enabled={availableCredentialStores.ceramic}
            setEnabled={handleCeramicToggle}
            shadow="md"
          />
        </span>
      </div>

      <div className="mt-20">
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6  text-gray-800">
          {t('advanced')}
        </div>
        <div className="mt-2 text-sm text-red-500">{t('not-implemented')}</div>
        <div></div>
      </div>
    </div>
  );
};

export default SettingsCard;
