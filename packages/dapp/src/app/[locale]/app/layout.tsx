import clsx from 'clsx';

import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import { SignInModal } from '@/components/SignInModal';
import ToastWrapper from '@/components/ToastWrapper';
import { Providers } from '@/components/Providers';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AppNavbar />
      <div
        className={clsx(
          'flex min-h-screen flex-col justify-center pt-24',
          'main-bg'
        )}
      >
        <div className="flex h-full w-full flex-1 flex-col px-2 pb-20 pt-12 sm:px-6 md:px-12">
          {children}
        </div>
      </div>
      <AppBottomBar />
      <SignInModal />
      <ToastWrapper />
    </Providers>
  );
}
