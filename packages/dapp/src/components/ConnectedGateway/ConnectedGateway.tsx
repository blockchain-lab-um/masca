import React, { useEffect } from 'react';
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
} from '@blockchain-lab-um/ssi-snap-connector';
import { useGeneralStore } from '../../utils/store';

type ConnectedGatewayProps = {
  children: React.ReactNode;
};

export const ConnectedGateway = ({ children }: ConnectedGatewayProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  if (isConnected) {
    return <>{children}</>;
  }
  return <>Connect MetaMask to use dApp!</>;
};
