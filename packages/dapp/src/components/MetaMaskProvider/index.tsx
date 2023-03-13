import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import detectEthereumProvider from '@metamask/detect-provider';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/utils/stores';

type MetaMaskProviderProps = {
  children: React.ReactNode;
};

const MetaMaskProvider = ({ children }: MetaMaskProviderProps) => {
  const { changeHasMetaMask, changeIsFlask, hasMM, hasFlask } = useGeneralStore(
    (state) => ({
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
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

  useEffect(() => {
    console.log("Checking MetaMask's compatibility...");
    checkMetaMaskCompatibility().catch((error) => {
      console.error(error);
    });
  }, []);

  if (router.pathname === '/' || (hasMM && hasFlask)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <h3 className="text-h3 text-gray-800">
        Install MetaMask Flask to use the dApp!
      </h3>
    </div>
  );
};

export default MetaMaskProvider;
