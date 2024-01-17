import clsx from 'clsx';

import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import { CookiesProvider } from '@/components/CookiesProvider';
import MascaProvider from '@/components/MascaProvider';
import QRCodeSessionProvider from '@/components/QRCodeSessionProvider';
import { SignInModal } from '@/components/SignInModal';
import ToastWrapper from '@/components/ToastWrapper';
import WagmiProviderWrapper from '@/components/WagmiProvider';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WagmiProviderWrapper>
        <AppNavbar />
        <div
          className={clsx(
            'flex min-h-screen flex-col justify-center pt-24',
            'main-bg'
          )}
        >
          <div className="flex h-full w-full flex-1 flex-col px-2 pb-20 pt-12 sm:px-6 md:px-12">
            <MascaProvider />
            {children}
          </div>
        </div>
      </WagmiProviderWrapper>
      <AppBottomBar />
      <ToastWrapper />
      <QRCodeSessionProvider />
      <SignInModal />
      <CookiesProvider />
    </>
  );
}
