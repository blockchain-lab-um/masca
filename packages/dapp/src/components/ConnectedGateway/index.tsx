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
  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <h3 className="text-h3 text-gray-800">
        Connect MetaMask to use the dApp!
      </h3>
    </div>
  );
};

export default ConnectedGateway;
