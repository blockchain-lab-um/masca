'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { config } from '../../config/wagmiConfig';
import { EncryptedSessionProvider } from '../EncryptedSessionProvider';
import { CookiesProvider } from '../CookiesProvider';
import MascaProvider from '../MascaProvider';

const queryClient = new QueryClient();

export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <EncryptedSessionProvider>
          <CookiesProvider>
            <MascaProvider>{children}</MascaProvider>
          </CookiesProvider>
        </EncryptedSessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
