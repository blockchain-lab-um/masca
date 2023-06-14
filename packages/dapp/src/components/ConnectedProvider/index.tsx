'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/stores';

type ConnectedProviderProps = {
  children: React.ReactNode;
};

const ConnectedProvider = ({ children }: ConnectedProviderProps) => {
  const t = useTranslations('Gateway');
  const {
    isConnected,
    isConnecting,
    changeAddress,
    changeIsConnecting,
    changeChainId,
  } = useGeneralStore(
    (state) => ({
      isConnected: state.isConnected,
      isConnecting: state.isConnecting,
      address: state.address,
      changeAddress: state.changeAddress,
      changeIsConnected: state.changeIsConnected,
      changeIsConnecting: state.changeIsConnecting,
      changeChainId: state.changeChainId,
    }),
    shallow
  );

  const connectHandler = async () => {
    if (window.ethereum) {
      const result: unknown = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chain = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;

      // Set the chainId
      changeChainId(chain);

      // Set the address
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
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex-1 rounded-3xl bg-white shadow-lg">
      <div className="flex h-full items-center justify-center">
        <h3 className="text-h4 md:text-h3 dark:text-navy-blue-50 text-gray-800">
          {t('connect')}
        </h3>
      </div>
    </div>
  );
};

export default ConnectedProvider;
