import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';
import detectEthereumProvider from '@metamask/detect-provider';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useGeneralStore, useMascaStore } from '@/stores';
import Button from '../Button';

const snapId =
  process.env.USE_LOCAL === 'true'
    ? 'local:http://localhost:8081'
    : 'npm:@blockchain-lab-um/masca';

type MetaMaskProviderProps = {
  children: React.ReactNode;
};

const MetaMaskProvider = ({ children }: MetaMaskProviderProps) => {
  const t = useTranslations('Gateway');
  const {
    hasMM,
    hasFlask,
    address,
    chainId,
    changeHasMetaMask,
    changeIsFlask,
    changeAddress,
    changeIsConnected,
    changeIsConnecting,
    changeChainId,
  } = useGeneralStore(
    (state) => ({
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
      address: state.address,
      isConnected: state.isConnected,
      chainId: state.chainId,
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
      changeAddress: state.changeAddress,
      changeIsConnected: state.changeIsConnected,
      changeIsConnecting: state.changeIsConnecting,
      changeChainId: state.changeChainId,
    }),
    shallow
  );

  const {
    changeMascaApi,
    changeDID,
    changeAvailableMethods,
    changeCurrMethod,
    changeAvailableVCStores,
  } = useMascaStore(
    (state) => ({
      changeMascaApi: state.changeMascaApi,
      changeDID: state.changeCurrDID,
      changeAvailableMethods: state.changeAvailableMethods,
      changeCurrMethod: state.changeCurrDIDMethod,
      changeAvailableVCStores: state.changeAvailableVCStores,
    }),
    shallow
  );

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

    const mmVersion = (await window.ethereum.request({
      method: 'web3_clientVersion',
    })) as string;

    if (!mmVersion.includes('flask')) {
      changeIsFlask(false);
      return;
    }

    changeIsFlask(true);
  };

  const enableMascaHandler = async () => {
    const enableResult = await enableMasca(address, { snapId });
    console.log(snapId);
    console.log(process.env.NODE_ENV);
    if (isError(enableResult)) {
      throw new Error(enableResult.error);
    }
    const api = enableResult.data.getMascaApi();

    changeMascaApi(api);

    // Set currently connected address
    const setAccountRes = await api.setCurrentAccount({
      currentAccount: address,
    });

    if (isError(setAccountRes)) {
      console.log("Couldn't set current account");
      throw new Error(setAccountRes.error);
    }

    const did = await api.getDID();
    if (isError(did)) {
      console.log("Couldn't get DID");
      throw new Error(did.error);
    }

    const availableMethods = await api.getAvailableMethods();
    if (isError(availableMethods)) {
      console.log("Couldn't get available methods");
      throw new Error(availableMethods.error);
    }

    const method = await api.getSelectedMethod();
    if (isError(method)) {
      console.log("Couldn't get selected method");
      throw new Error(method.error);
    }

    const accountSettings = await api.getAccountSettings();
    if (isError(accountSettings)) {
      console.log("Couldn't get account settings");
      throw new Error(accountSettings.error);
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
      window.ethereum.on('accountsChanged', (...accounts) => {
        changeAddress((accounts[0] as string[])[0]);
      });
      window.ethereum.on('chainChanged', (...chain) => {
        changeChainId(chain[0] as string);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [hasMM, hasFlask]);

  useEffect(() => {
    if (!hasMM || !hasFlask || !address) return;
    console.log('Address changed to', address);
    enableMascaHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
      changeAddress('');
    });
  }, [hasMM, hasFlask, address]);

  if (router.pathname === '/' || (hasMM && hasFlask)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <h3 className="text-h3 dark:text-navy-blue-50 text-gray-800">
        {t('flask')}
        <div className="mt-16 flex items-center justify-center">
          <Button
            variant="gray"
            onClick={() => {
              window.open('https://metamask.io/flask/');
            }}
          >
            MetaMask Flask
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </Button>
        </div>
      </h3>
    </div>
  );
};

export default MetaMaskProvider;
