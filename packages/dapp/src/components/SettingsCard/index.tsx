'use client';

import { isError } from '@blockchain-lab-um/utils';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import ToggleSwitch from '@/components/Switch';
import { useMascaStore, useToastStore } from '@/stores';

const SettingsCard = () => {
  const t = useTranslations('Settings');
  const { api, availableVCStores, changeAvailableVCStores } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      availableVCStores: state.availableVCStores,
      changeAvailableVCStores: state.changeAvailableVCStores,
    }),
    shallow
  );

  const snapGetAvailableVCStores = async () => {
    if (!api) return;
    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log('Error getting account settings', accountSettings);
      return;
    }
    changeAvailableVCStores(accountSettings.data.ssi.vcStore);
  };

  const snapChangeAvailableVCStores = async (
    store: 'ceramic' | 'snap',
    value: boolean
  ) => {
    if (!api) return;
    const res = await api.setVCStore(store, value);
    await snapGetAvailableVCStores();
    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failed to toggle ceramic',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Successfully toggled ceramic',
        type: 'success',
        loading: false,
      });
    }, 200);
  };

  const handleCeramicToggle = async (enabled: boolean) => {
    await snapChangeAvailableVCStores('ceramic', enabled);
  };

  return (
    <div className="h-full p-6 text-lg">
      <div>
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900">
          {t('data-store')}
        </div>
        <div className="mt-5">
          <p className="text-md dark:text-navy-blue-400 text-gray-600 ">
            {t('data-store-desc')}{' '}
          </p>
        </div>

        <span className="dark:text-navy-blue-200 mt-10 flex justify-between text-gray-800 ">
          Ceramic{' '}
          <ToggleSwitch
            size="md"
            enabled={availableVCStores.ceramic}
            setEnabled={handleCeramicToggle}
            shadow="md"
          />
        </span>
      </div>

      <div className="mt-20">
        <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6  text-gray-900">
          {t('advanced')}
        </div>
        <div className="mt-2 text-sm text-red-500">Not implemented yet.</div>
        <div></div>
      </div>
    </div>
  );
};

export default SettingsCard;
