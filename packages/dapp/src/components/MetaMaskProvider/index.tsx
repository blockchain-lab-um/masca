import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';
import detectEthereumProvider from '@metamask/detect-provider';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useGeneralStore, useMascaStore } from '@/stores';

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
      console.error(enableResult.error);
      changeIsConnecting(false);
      return;
    }
    const api = enableResult.data.getMascaApi();

    changeMascaApi(api);

    // Set currently connected address
    const setAccountRes = await api.setCurrentAccount({
      currentAccount: address,
    });

    if (isError(setAccountRes)) {
      console.log("Couldn't set current account");
      console.error(setAccountRes.error);
      changeIsConnecting(false);
      return;
    }

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
      window.ethereum.on('accountsChanged', (...accounts) => {
        changeAddress(accounts[0] as string);
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
    });
  }, [hasMM, hasFlask, address]);

  if (router.pathname === '/' || (hasMM && hasFlask)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <h3 className="text-h3 dark:text-navy-blue-50 text-gray-800">
        {t('flask')}
      </h3>
    </div>
  );
};

export default MetaMaskProvider;
