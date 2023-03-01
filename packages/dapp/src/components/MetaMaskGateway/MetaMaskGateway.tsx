import React, { useEffect } from 'react';
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
} from '@blockchain-lab-um/ssi-snap-connector';

import { useGeneralStore } from '../../utils/store';

type MetaMaskGatewayProps = {
  children: React.ReactNode;
};

export const MetaMaskGateway = ({ children }: MetaMaskGatewayProps) => {
  const changeHasMetaMask = useGeneralStore((state) => state.changeHasMetaMask);
  const changeIsFlask = useGeneralStore((state) => state.changeIsFlask);
  const hasMM = useGeneralStore((state) => state.hasMetaMask);
  const hasFlask = useGeneralStore((state) => state.isFlask);

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
