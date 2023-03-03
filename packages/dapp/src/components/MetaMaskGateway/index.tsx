import React, { useEffect } from 'react';
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
} from '@blockchain-lab-um/ssi-snap-connector';
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
      const res = await isMetamaskSnapsSupported();
      changeIsFlask(res);
    };
    const mm = hasMetaMask();
    changeHasMetaMask(mm);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    isSnapsSupported();
  }, []);

  if (hasMM && hasFlask) {
    return <>{children}</>;
  }
  return <>Install MM Flask To use!</>;
};

export default MetaMaskGateway;
