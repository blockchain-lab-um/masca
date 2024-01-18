'use client';

import { useEffect } from 'react';
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';
import { useAccount, useChainId } from 'wagmi';

import { useGeneralStore, useMascaStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

const snapId =
  process.env.USE_LOCAL === 'true'
    ? 'local:http://localhost:8081'
    : 'npm:@blockchain-lab-um/masca';

const MascaProvider = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  // const {} = useConnect();

  const { provider, changeChainId, changeProvider } = useGeneralStore(
    (state) => ({
      provider: state.provider,
      changeChainId: state.changeChainId,
      changeProvider: state.changeProvider,
    })
  );

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

  useEffect(() => {
    changeChainId(`0x${chainId.toString(16)}`);
  }, [chainId]);

  const enableMascaHandler = async () => {
    if (!address) return;
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
    changePopups(snapSettings.data.dApp.disablePopups);
  };

  // useEffect(() => {
  //   if (provider) {
  //     provider.on('chainChanged', (...chain) => {
  //       changeChainId(chain[0] as string);
  //     });
  //   }

  //   return () => {
  //     if (provider) {
  //       provider.removeAllListeners('accountsChanged');
  //       provider.removeAllListeners('chainChanged');
  //     }
  //   };
  // }, [hasMM]);

  // useEffect(() => {
  //   // const lsIsConnected = localStorage.getItem('isConnected');
  //   // if (isConnected !== true) return;
  //   // if (!hasMM) return;
  //   // if (isConnected) return;
  //   // if (isConnecting) return;
  //   // changeIsConnecting(true);
  //   // connectHandler().catch((err) => {
  //   //   console.error(err);
  //   //   changeIsConnecting(false);
  //   // });
  // }, [hasMM]);

  useEffect(() => {
    if (!address) return;
    enableMascaHandler().catch((err) => {
      console.error(err);
    });
  }, [isConnected, address]);

  // useEffect(() => {
  //   handleProviderAnnouncement().catch((err) => {
  //     console.error(err);
  //   });
  // }, []);

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

  // useEffect(() => {
  //   if (isConnected || !isConnecting) return;
  //   // connectHandler().catch((err) => {
  //   //   console.error(err);
  //   //   changeIsConnecting(false);
  //   // });
  // }, [isConnected, isConnecting]);

  useEffect(() => {
    if (isSignedIn) return;
    return;
    changeIsSignInModalOpen(true);
  }, [isSignedIn]);

  return null;
};

export default MascaProvider;
