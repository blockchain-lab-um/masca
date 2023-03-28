import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/utils/stores';

type ConnectedProviderProps = {
  children: React.ReactNode;
};

const ConnectedProvider = ({ children }: ConnectedProviderProps) => {
  const t = useTranslations('Gateway');
  const { isConnected, isConnecting, changeAddress, changeIsConnecting } =
    useGeneralStore(
      (state) => ({
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        address: state.address,
        changeAddress: state.changeAddress,
        changeIsConnected: state.changeIsConnected,
        changeIsConnecting: state.changeIsConnecting,
      }),
      shallow
    );

  const connectHandler = async () => {
    if (window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const result: unknown = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      changeAddress((result as string[])[0]);
    }
  };

  useEffect(() => {
    if (isConnected || !isConnecting) return;
    console.log('Connecting to MetaMask...');
    connectHandler().catch((err) => {
      console.error(err);
      changeIsConnecting(false);
    });
  }, [isConnected, isConnecting]);

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6">
      <h3 className="text-h3 dark:text-navy-blue-50 text-center text-gray-800">
        {t('connect')}
      </h3>
    </div>
  );
};

export default ConnectedProvider;
