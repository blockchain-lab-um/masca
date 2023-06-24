'use client';

import { useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/stores';

const CheckMetaMaskCompatibility = () => {
  const { changeHasMetaMask, changeIsFlask } = useGeneralStore(
    (state) => ({
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
    }),
    shallow
  );

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

  useEffect(() => {
    checkMetaMaskCompatibility().catch((error) => {
      console.error(error);
    });
  }, []);

  return null;
};

export default CheckMetaMaskCompatibility;
