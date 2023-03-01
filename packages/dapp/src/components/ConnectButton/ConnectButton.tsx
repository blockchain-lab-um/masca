/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import Image from 'next/image';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';

import spinner from '../../images/connect-spinner.png';
import { useGeneralStore, useSnapStore } from '../../utils/store';
import Button from '../Button';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const ConnectButton = () => {
  const [loading, setLoading] = React.useState(false);
  const changeAddress = useGeneralStore((state) => state.changeAddress);
  const changeIsConnected = useGeneralStore((state) => state.changeIsConnected);
  const changeHasSnapInstalled = useGeneralStore(
    (state) => state.changeHasSnapInstalled
  );
  const changeDID = useSnapStore((state) => state.changeCurrDID);
  const changeAvailableMethods = useSnapStore(
    (state) => state.changeAvailableMethods
  );
  const changeSnapApi = useSnapStore((state) => state.changeSnapApi);
  const changeCurrMethod = useSnapStore((state) => state.changeCurrDIDMethod);
  const changeAvailableVCStores = useSnapStore(
    (state) => state.changeAvailableVCStores
  );

  const snapId = 'local:http://localhost:8081';

  const connect = async () => {
    if (window.ethereum) {
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
        const snap = await enableSSISnap({ snapId });
        const api = await snap.getSSISnapApi();
        changeSnapApi(api);
        const did = await api.getDID();
        const availableMethods = await api.getAvailableMethods();
        const method = await api.getSelectedMethod();
        const accountSettings = await api.getAccountSettings();
        changeHasSnapInstalled(true);
        changeIsConnected(true);
        changeDID(did);
        changeAvailableMethods(availableMethods);
        changeCurrMethod(method);
        changeAvailableVCStores(accountSettings.ssi.vcStore);
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button variant="connect" size="md" onClick={handleConnect}>
      <div className="flex">
        Connect Wallet
        {loading && (
          <Image
            src={spinner}
            alt="Masca Logo"
            className="w-6 h-6 rounded-full object-center animate-spin"
          />
        )}
      </div>
    </Button>
  );
};
