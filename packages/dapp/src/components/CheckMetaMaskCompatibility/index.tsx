'use client';

import { useEffect } from 'react';
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

import { useGeneralStore, useMascaStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

const snapId =
  process.env.USE_LOCAL === 'true'
    ? 'local:http://localhost:8081'
    : 'npm:@blockchain-lab-um/masca';

const CheckMetaMaskCompatibility = () => {
  const { changeHasMetaMask } = useGeneralStore((state) => ({
    changeHasMetaMask: state.changeHasMetaMask,
  }));

  const {
    hasMM,
    address,
    isConnected,
    isConnecting,
    chainId,
    provider,
    changeAddress,
    changeIsConnected,
    changeIsConnecting,
    changeChainId,
    changeProvider,
  } = useGeneralStore((state) => ({
    hasMM: state.hasMetaMask,
    address: state.address,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    chainId: state.chainId,
    provider: state.provider,
    changeAddress: state.changeAddress,
    changeIsConnected: state.changeIsConnected,
    changeIsConnecting: state.changeIsConnecting,
    changeChainId: state.changeChainId,
    changeProvider: state.changeProvider,
  }));

  const {
    api,
    changeMascaApi,
    changeDID,
    changeAvailableMethods,
    changeCurrMethod,
    changeAvailableCredentialStores,
    changePopups,
  } = useMascaStore((state) => ({
    api: state.mascaApi,
    changeMascaApi: state.changeMascaApi,
    changeDID: state.changeCurrDID,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
    changeAvailableCredentialStores: state.changeAvailableCredentialStores,
    changePopups: state.changePopups,
  }));

  const { isSignedIn, changeIsSignInModalOpen } = useAuthStore((state) => ({
    isSignedIn: state.isSignedIn,
    changeIsSignInModalOpen: state.changeIsSignInModalOpen,
  }));

  const connectHandler = async () => {
    if (provider) {
      const result: unknown = await provider.request({
        method: 'eth_requestAccounts',
      });

      const chain = (await provider.request({
        method: 'eth_chainId',
      })) as string;
      changeChainId(chain);
      changeAddress((result as string[])[0]);
      localStorage.setItem('isConnected', 'true');
    }
  };

  // EIP-6963 multi wallet provider announcement handler implemented in enableMasca
  // more advanced logic is automatically handled in enableMasca
  // this method is basically only used for UI updates whether or not MetaMask is installed
  const handleProviderAnnouncement = async () => {
    window.addEventListener('eip6963:announceProvider', async (event) => {
      const providerDetail = (event as CustomEvent).detail;
      // FIXME: Christian's example on how to handle EIP-6963 with snaps, revisit when the MetaMask SDK supports snaps
      // https://github.com/Montoya/snap-connect-example#readme
      switch (providerDetail.info.rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi': // MetaMask Institutional
          changeHasMetaMask(true);
          changeProvider(providerDetail.provider);
          break;
        default:
          break;
      }
    });

    window.dispatchEvent(new Event('eip6963:requestProvider'));
  };

  const enableMascaHandler = async () => {
    if (!provider) return;
    const enableResult = await enableMasca(address, {
      snapId,
      version: process.env.NEXT_PUBLIC_MASCA_VERSION,
    });
    if (isError(enableResult)) {
      // FIXME: This error is shown as [Object object]
      throw new Error(enableResult.error);
    }
    const mascaApi = enableResult.data.getMascaApi();

    changeMascaApi(mascaApi);

    // Set currently connected address
    const setAccountRes = await mascaApi.setCurrentAccount({
      account: address,
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
    changeAvailableCredentialStores(accountSettings.data.ssi.storesEnabled);
    changeIsConnected(true);
    changeIsConnecting(false);
    changePopups(snapSettings.data.dApp.disablePopups);
  };

  useEffect(() => {
    if (hasMM && provider) {
      provider.on('accountsChanged', (...accounts) => {
        changeAddress((accounts[0] as string[])[0]);
      });
      provider.on('chainChanged', (...chain) => {
        changeChainId(chain[0] as string);
      });
    }

    return () => {
      if (provider) {
        provider.removeAllListeners('accountsChanged');
        provider.removeAllListeners('chainChanged');
      }
    };
  }, [hasMM]);

  useEffect(() => {
    const lsIsConnected = localStorage.getItem('isConnected');
    if (lsIsConnected !== 'true') return;
    if (!hasMM) return;
    if (isConnected) return;
    if (isConnecting) return;
    changeIsConnecting(true);
    connectHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
  }, [hasMM]);

  useEffect(() => {
    if (!hasMM || !address) return;
    console.log('Address changed to', address);
    enableMascaHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
      changeAddress('');
    });
  }, [hasMM, address]);

  useEffect(() => {
    handleProviderAnnouncement().catch((err) => {
      console.error(err);
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
    connectHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
  }, [isConnected, isConnecting]);

  useEffect(() => {
    if (isSignedIn) return;
    if (!isConnected) return;

    changeIsSignInModalOpen(true);
  }, [isSignedIn, isConnected]);

  return null;
};

export default CheckMetaMaskCompatibility;
