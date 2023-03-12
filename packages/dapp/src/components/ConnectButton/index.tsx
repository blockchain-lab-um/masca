import React from 'react';
import Image from 'next/image';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import { isError } from '@blockchain-lab-um/utils';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { BASE_PATH } from '@/utils/constants';
import { useGeneralStore, useSnapStore } from '@/utils/stores';

const ConnectButton = () => {
  const [loading, setLoading] = React.useState(false);
  const { changeAddress, changeIsConnected, changeHasSnapInstalled } =
    useGeneralStore(
      (state) => ({
        changeAddress: state.changeAddress,
        changeIsConnected: state.changeIsConnected,
        changeHasSnapInstalled: state.changeHasSnapInstalled,
      }),
      shallow
    );
  const {
    changeDID,
    changeAvailableMethods,
    changeSnapApi,
    changeCurrMethod,
    changeAvailableVCStores,
  } = useSnapStore(
    (state) => ({
      changeDID: state.changeCurrDID,
      changeAvailableMethods: state.changeAvailableMethods,
      changeSnapApi: state.changeSnapApi,
      changeCurrMethod: state.changeCurrDIDMethod,
      changeAvailableVCStores: state.changeAvailableVCStores,
    }),
    shallow
  );

  const snapId = 'local:http://localhost:8081';
  // const snapId = 'npm:@blockchain-lab-um/ssi-snap';

  const connect = async () => {
    if (window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result: unknown) => {
          changeAddress((result as string[])[0]);
        })
        .catch((err: Error) => {
          console.error(err);
        });

      try {
        setLoading(true);
        const enableResult = await enableSSISnap({ snapId });
        if (isError(enableResult)) {
          console.log("Couldn't connect to SSI Snap", enableResult);
          return;
        }
        const snap = enableResult.data;
        const api = snap.getSSISnapApi();
        changeSnapApi(api);

        const did = await api.getDID();
        if (isError(did)) {
          console.log("Couldn't get DID", did);
          return;
        }
        const availableMethods = await api.getAvailableMethods();
        if (isError(availableMethods)) {
          console.log("Couldn't get available methods", availableMethods);
          return;
        }
        const method = await api.getSelectedMethod();
        if (isError(method)) {
          console.log("Couldn't get selected method", method);
          return;
        }
        const accountSettings = await api.getAccountSettings();
        if (isError(accountSettings)) {
          console.log("Couldn't get account settings", accountSettings);
          return;
        }
        changeHasSnapInstalled(true);
        changeIsConnected(true);
        changeDID(did.data);
        changeAvailableMethods(availableMethods.data);
        changeCurrMethod(method.data);
        changeAvailableVCStores(accountSettings.data.ssi.vcStore);
        console.log('Successfuly installed snap');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Couldn't connect to SSI Snap", err);
      }
    }
  };

  const handleConnect = async () => {
    console.log('Connecting...');
    await connect();
  };

  return (
    <Button variant="connect" size="md" onClick={handleConnect}>
      <div className="flex">
        Connect Wallet
        {loading && (
          <div className="w-6 h-6 rounded-full object-center">
            <Image
              src={`${BASE_PATH}/images/connect-spinner.png`}
              alt="Masca Logo"
              className="animate-spin"
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
    </Button>
  );
};

export default ConnectButton;
