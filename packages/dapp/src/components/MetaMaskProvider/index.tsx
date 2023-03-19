import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import { isError } from '@blockchain-lab-um/utils';
import detectEthereumProvider from '@metamask/detect-provider';
import { shallow } from 'zustand/shallow';

import { useGeneralStore, useSnapStore } from '@/utils/stores';

const snapId = 'local:http://localhost:8081';
// const snapId = 'npm:@blockchain-lab-um/ssi-snap';

type MetaMaskProviderProps = {
  children: React.ReactNode;
};

const MetaMaskProvider = ({ children }: MetaMaskProviderProps) => {
  const {
    hasMM,
    hasFlask,
    address,
    changeHasMetaMask,
    changeIsFlask,
    changeAddress,
    changeIsConnected,
    changeIsConnecting,
  } = useGeneralStore(
    (state) => ({
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
      address: state.address,
      isConnected: state.isConnected,
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
      changeAddress: state.changeAddress,
      changeIsConnected: state.changeIsConnected,
      changeIsConnecting: state.changeIsConnecting,
    }),
    shallow
  );

  const {
    changeSnapApi,
    changeDID,
    changeAvailableMethods,
    changeCurrMethod,
    changeAvailableVCStores,
  } = useSnapStore((state) => ({
    snapApi: state.snapApi,
    changeSnapApi: state.changeSnapApi,
    changeDID: state.changeCurrDID,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
    changeAvailableVCStores: state.changeAvailableVCStores,
  }));

  const router = useRouter();

  const checkMetaMaskCompatibility = async () => {
    try {
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });

      if (!provider) {
        changeHasMetaMask(false);
        changeIsFlask(false);
        return;
      }
    } catch (error) {
      changeHasMetaMask(false);
      changeIsFlask(false);
    }

    changeHasMetaMask(true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const mmVersion: string = await window.ethereum.request({
      method: 'web3_clientVersion',
    });

    if (!mmVersion.includes('flask')) {
      changeIsFlask(false);
      return;
    }

    changeIsFlask(true);
  };

  const enableSSISnapHandler = async () => {
    const enableResult = await enableSSISnap({ snapId });

    if (isError(enableResult)) {
      console.error(enableResult.error);
      changeIsConnecting(false);
      return;
    }

    const api = enableResult.data.getSSISnapApi();

    changeSnapApi(api);

    const did = await api.getDID();
    if (isError(did)) {
      console.log("Couldn't get DID");
      console.error(did.error);
      changeIsConnecting(false);
      return;
    }

    const availableMethods = await api.getAvailableMethods();
    if (isError(availableMethods)) {
      console.log("Couldn't get available methods");
      console.error(availableMethods.error);
      changeIsConnecting(false);
      return;
    }

    const method = await api.getSelectedMethod();
    if (isError(method)) {
      console.log("Couldn't get selected method");
      console.error(method.error);
      changeIsConnecting(false);
      return;
    }

    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log("Couldn't get account settings");
      console.error(accountSettings.error);
      changeIsConnecting(false);
      return;
    }

    changeDID(did.data);
    changeAvailableMethods(availableMethods.data);
    changeCurrMethod(method.data);
    changeAvailableVCStores(accountSettings.data.ssi.vcStore);
    changeIsConnected(true);
    changeIsConnecting(false);
  };

  useEffect(() => {
    checkMetaMaskCompatibility().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (hasMM && hasFlask && window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        changeAddress(accounts[0]);
      });
    }
    return () => {
      if (window.ethereum) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [hasMM, hasFlask]);

  useEffect(() => {
    if (!hasMM || !hasFlask || !address) return;
    console.log('Address changed to', address);
    enableSSISnapHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
  }, [hasMM, hasFlask, address]);

  if (router.pathname === '/' || (hasMM && hasFlask)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <h3 className="text-h3 dark:text-navy-blue-50 text-gray-800">
        Install MetaMask Flask to use the dApp!
      </h3>
    </div>
  );
};

export default MetaMaskProvider;
