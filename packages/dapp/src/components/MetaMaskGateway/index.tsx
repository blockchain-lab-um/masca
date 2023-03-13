import React, { useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/utils/stores';

type MetaMaskGatewayProps = {
  children: React.ReactNode;
};

const MetaMaskGateway = ({ children }: MetaMaskGatewayProps) => {
  const { changeHasMetaMask, changeIsFlask, hasMM, hasFlask } = useGeneralStore(
    (state) => ({
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
    }),
    shallow
  );

  useEffect(() => {
    const isSnapsSupported = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const mmVersion: string = await window.ethereum.request({
        method: 'web3_clientVersion',
      });

      if (!mmVersion.includes('flask')) {
        changeIsFlask(false);
      }
      changeIsFlask(true);
    };

    const isMetaMask = async () => {
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });

      if (!provider) {
        changeHasMetaMask(false);
      }
      changeHasMetaMask(true);
    };

    isMetaMask()
      .then(() => {})
      .catch(() => {});
    isSnapsSupported()
      .then(() => {})
      .catch(() => {});
  }, []);

  if (hasMM && hasFlask) {
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

export default MetaMaskGateway;
