import clsx from 'clsx';

import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import CheckMetaMaskCompatibility from '@/components/CheckMetaMaskCompatibility';
import { CookiesProvider } from '@/components/CookiesProvider';
import QRCodeSessionProvider from '@/components/QRCodeSessionProvider';
import { SignInModal } from '@/components/SignInModal';
import ToastWrapper from '@/components/ToastWrapper';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      <div
        className={clsx(
          'flex min-h-screen flex-col justify-center pt-24',
          'main-bg'
        )}
      >
        <div className="flex h-full w-full flex-1 flex-col px-2 pb-20 pt-12 sm:px-6 md:px-12">
          <CheckMetaMaskCompatibility />
          {children}
        </div>
      </div>
      <AppBottomBar />
      <ToastWrapper />
      <QRCodeSessionProvider />
      <SignInModal />
      <CookiesProvider />
    </>
  );
}
