/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import Button from '../Button';
import { useSnapStore, useGeneralStore } from '../../utils/store';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const ConnectButton = () => {
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
        const snap = await enableSSISnap({ snapId });
        const api = await snap.getSSISnapApi();
        changeSnapApi(api);
        const did = await api.getDID();
        const availableMethods = await api.getAvailableMethods();
        const method = await api.getSelectedMethod();
        changeHasSnapInstalled(true);
        changeIsConnected(true);
        changeDID(did);
        changeAvailableMethods(availableMethods);
        changeCurrMethod(method);
        console.log('Successfuly installed snap');
      } catch (err) {
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
    <Button className="btn-connect" onClick={handleConnect}>
      Connect Wallet
    </Button>
  );
};
