import React from 'react';

import { useGeneralStore } from '@/utils/stores';

type ConnectedProviderProps = {
  children: React.ReactNode;
};

const ConnectedProvider = ({ children }: ConnectedProviderProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6">
      <h3 className="text-h3 text-center text-gray-800">
        Connect MetaMask to use the dApp!
      </h3>
    </div>
  );
};

export default ConnectedProvider;
