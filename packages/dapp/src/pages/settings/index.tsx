import React from 'react';
import Head from 'next/head';
import { isError } from '@blockchain-lab-um/utils';
import { shallow } from 'zustand/shallow';

import ConnectedProvider from '@/components/ConnectedProvider';
import ToggleSwitch from '@/components/Switch';
import { useSnapStore } from '@/utils/stores';

export default function Settings() {
  const { availableVCStores, changeAvailableVCStores, api } = useSnapStore(
    (state) => ({
      availableVCStores: state.availableVCStores,
      changeAvailableVCStores: state.changeAvailableVCStores,
      api: state.snapApi,
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
    console.log('Changing available VC store');
    if (!api) return;
    const res = await api.setVCStore(store, value);
    console.log(res);
    await snapGetAvailableVCStores();
  };

  const handleCeramicToggle = async (enabled: boolean) => {
    await snapChangeAvailableVCStores('ceramic', enabled);
  };

  return (
    <>
      <Head>
        <title>Masca | Settings</title>
        <meta name="description" content="Settings page for Masca." />
      </Head>
      <div className="grid place-items-center">
        <div className="flex h-full min-h-[40vh] w-full max-w-sm flex-col rounded-3xl border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:shadow-orange-900 md:max-w-md lg:max-w-lg  xl:w-[34rem] xl:max-w-[34rem]">
          <ConnectedProvider>
            <div className="p-4 text-lg">
              <div>
                <div className="text-h4 font-semibold text-orange-500">
                  Data Stores
                </div>
                <div className="text-md mt-2 text-gray-600">
                  Enable or disable data stores. Data stores are places where
                  VCs are stored.{' '}
                </div>
                <span className="mt-4 flex justify-between text-gray-800">
                  Ceramic{' '}
                  <ToggleSwitch
                    enabled={availableVCStores.ceramic}
                    setEnabled={handleCeramicToggle}
                    shadow="md"
                  />
                </span>
              </div>

              <div className="mt-6">
                <span className="text-h4 font-semibold text-orange-500">
                  Advanced
                </span>
                <div className="mt-2 text-sm text-red-500">
                  Not implemented yet.
                </div>
                <div></div>
              </div>
            </div>
          </ConnectedProvider>
        </div>
      </div>
    </>
  );
}
