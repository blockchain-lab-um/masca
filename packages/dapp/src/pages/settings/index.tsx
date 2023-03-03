import React from 'react';
import { shallow } from 'zustand/shallow';

import ConnectedGateway from '@/components/ConnectedGateway';
import MetaMaskGateway from '@/components/MetaMaskGateway';
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
    changeAvailableVCStores(accountSettings.ssi.vcStore);
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
    <MetaMaskGateway>
      <div className="grid place-items-center">
        <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[34rem] xl:w-[34rem] w-full h-full flex flex-col min-h-[40vh] border border-gray-200 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
          <ConnectedGateway>
            <div className="p-4 text-lg">
              <div>
                <div className="text-orange-500 font-semibold text-h4">
                  Data Stores
                </div>
                {/* <span className="text-gray-800 flex justify-between mt-4">
                  Snap{' '}
                  <ToggleSwitch
                    enabled={availableVCStores.snap}
                    setEnabled={handleSnapToggle}
                    shadow="md"
                  />
                </span> */}
                <div className="mt-2 text-md text-gray-600">
                  Enable or disable data stores. Data stores are places where
                  VCs are stored.{' '}
                </div>
                <span className="text-gray-800 flex justify-between mt-4">
                  Ceramic{' '}
                  <ToggleSwitch
                    enabled={availableVCStores.ceramic}
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    setEnabled={handleCeramicToggle}
                    shadow="md"
                  />
                </span>
              </div>

              <div className="mt-6">
                <span className="text-orange-500 font-semibold text-h4">
                  Advanced
                </span>
                <div className="text-red-500 mt-2 text-sm">
                  Not implemented yet.
                </div>
                <div></div>
              </div>
            </div>
          </ConnectedGateway>
        </div>
      </div>
    </MetaMaskGateway>
  );
}
