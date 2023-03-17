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
    if (!api) return;
    const res = await api.setVCStore(store, value);
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
        <div className="dark:bg-navy-blue-800 flex h-full min-h-[40vh] w-full max-w-sm flex-col rounded-3xl bg-white shadow-lg  md:max-w-md lg:max-w-lg  xl:w-[34rem] xl:max-w-[34rem]">
          <ConnectedProvider>
            <div className="p-4 text-lg">
              <div>
                <div className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6  text-gray-900">
                  Data Stores
                </div>
                <div className="mt-5">
                  <p className="text-md dark:text-navy-blue-400 text-gray-600 ">
                    Enable or disable data stores. Data stores are places where
                    VCs are stored.{' '}
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
                  Advanced
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
    </>
  );
}
