import React from 'react';

import { useGeneralStore } from '@/utils/stores';

type ConnectedGatewayProps = {
  children: React.ReactNode;
};

const ConnectedGateway = ({ children }: ConnectedGatewayProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  if (isConnected) {
    return <>{children}</>;
  }
  return <>Connect MetaMask to use dApp!</>;
};

export default ConnectedGateway;
