import React from 'react';
import { isError } from '@blockchain-lab-um/utils';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import ConnectedProvider from '@/components/ConnectedProvider';
import ToggleSwitch from '@/components/Switch';
import { useMascaStore, useToastStore } from '@/stores';

export default function Settings() {
  const t = useTranslations('Settings');
  const { setTitle, setLoading, setToastOpen, setType } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
      setType: state.setType,
    }),
    shallow
  );
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
      setToastOpen(false);
      setTimeout(() => {
        setTitle('Failed to toggle ceramic');
        setType('error');
        setLoading(false);
        setToastOpen(true);
      }, 100);
    }
  };

  const handleCeramicToggle = async (enabled: boolean) => {
    await snapChangeAvailableVCStores('ceramic', enabled);
  };

  return (
    <div className="flex justify-center">
      <div className="dark:bg-navy-blue-800 flex h-full min-h-[40vh] w-full max-w-sm flex-col rounded-3xl bg-white shadow-lg  md:max-w-md lg:max-w-lg  xl:w-[34rem] xl:max-w-[34rem]">
        <ConnectedProvider>
          <div className="p-4 text-lg">
            <div>
              <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6  text-gray-900">
                {t('ds')}
              </div>
              <div className="mt-5">
                <p className="text-md dark:text-navy-blue-400 text-gray-600 ">
                  {t('ds-desc')}{' '}
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
              <div className="mt-2 text-sm text-red-500">
                Not implemented yet.
              </div>
              <div></div>
            </div>
          </div>
        </ConnectedProvider>
      </div>
    </div>
  );
}

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
