'use client';

import { useEffect } from 'react';
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';
import detectEthereumProvider from '@metamask/detect-provider';
import { shallow } from 'zustand/shallow';

import mascaVersionJson from '@/utils/masca.json';
import { useGeneralStore, useMascaStore } from '@/stores';

const snapId =
  process.env.USE_LOCAL === 'true'
    ? 'local:http://localhost:8081'
    : 'npm:@blockchain-lab-um/masca';

const CheckMetaMaskCompatibility = () => {
  const { changeHasMetaMask, changeIsFlask } = useGeneralStore(
    (state) => ({
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
    }),
    shallow
  );

  const {
    hasMM,
    hasFlask,
    address,
    isConnected,
    isConnecting,
    chainId,
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
      isConnecting: state.isConnecting,
      chainId: state.chainId,
      changeAddress: state.changeAddress,
      changeIsConnected: state.changeIsConnected,
      changeIsConnecting: state.changeIsConnecting,
      changeChainId: state.changeChainId,
    }),
    shallow
  );

  const {
    api,
    changeMascaApi,
    changeDID,
    changeAvailableMethods,
    changeCurrMethod,
    changeAvailableCredentialStores,
    changePopups,
  } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      changeMascaApi: state.changeMascaApi,
      changeDID: state.changeCurrDID,
      changeAvailableMethods: state.changeAvailableMethods,
      changeCurrMethod: state.changeCurrDIDMethod,
      changeAvailableCredentialStores: state.changeAvailableCredentialStores,
      changePopups: state.changePopups,
    }),
    shallow
  );

  const connectHandler = async () => {
    if (window.ethereum) {
      const result: unknown = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chain = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;

      // Set the chainId
      changeChainId(chain);

      // Set the address
      changeAddress((result as string[])[0]);
    }
  };

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
    const enableResult = await enableMasca(address, {
      snapId,
      version: mascaVersionJson.mascaVersion,
    });
    if (isError(enableResult)) {
      // FIXME: This error is shown as [Object object]
      throw new Error(enableResult.error);
    }
    const mascaApi = enableResult.data.getMascaApi();

    changeMascaApi(mascaApi);

    // Set currently connected address
    const setAccountRes = await mascaApi.setCurrentAccount({
      currentAccount: address,
    });

    if (isError(setAccountRes)) {
      console.log("Couldn't set current account");
      throw new Error(setAccountRes.error);
    }

    const did = await mascaApi.getDID();
    if (isError(did)) {
      console.log("Couldn't get DID");
      throw new Error(did.error);
    }

    const availableMethods = await mascaApi.getAvailableMethods();
    if (isError(availableMethods)) {
      console.log("Couldn't get available methods");
      throw new Error(availableMethods.error);
    }

    const method = await mascaApi.getSelectedMethod();
    if (isError(method)) {
      console.log("Couldn't get selected method");
      throw new Error(method.error);
    }

    const accountSettings = await mascaApi.getAccountSettings();
    if (isError(accountSettings)) {
      console.log("Couldn't get account settings");
      throw new Error(accountSettings.error);
    }

    const snapSettings = await mascaApi.getSnapSettings();
    if (isError(snapSettings)) {
      console.log("Couldn't get snap settings");
      throw new Error(snapSettings.error);
    }

    changeDID(did.data);
    changeAvailableMethods(availableMethods.data);
    changeCurrMethod(method.data);
    changeAvailableCredentialStores(accountSettings.data.ssi.vcStore);
    changeIsConnected(true);
    changeIsConnecting(false);
    changePopups(snapSettings.data.dApp.disablePopups);
  };

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
    if (!hasMM || !hasFlask) return;
    if (isConnected) return;
    if (isConnecting) return;
    changeIsConnecting(true);
    connectHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
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

  useEffect(() => {
    checkMetaMaskCompatibility().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (!api) return;

    api
      .getDID()
      .then((res) => {
        if (isError(res)) {
          throw new Error("Couldn't get DID");
        }

        changeDID(res.data);
      })
      .catch((err) => console.log(err));
  }, [chainId]);

  useEffect(() => {
    if (isConnected || !isConnecting) return;
    console.log('Connecting to MetaMask...');
    connectHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
  }, [isConnected, isConnecting]);

  return null;
};

export default CheckMetaMaskCompatibility;
