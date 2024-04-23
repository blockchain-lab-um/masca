import clsx from 'clsx';

import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import { SignInModal } from '@/components/SignInModal';
import ToastWrapper from '@/components/ToastWrapper';
import { Providers } from '@/components/Providers';
import { ScrollShadow } from '@nextui-org/react';
import Banner from '@/components/Banner';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex flex-col h-screen pb-6">
        <div>
          <Banner />
        </div>
        <div className="flex flex-col h-full px-4 pb-6 sm:px-12">
          <div className="p-6 m-0 sm:px-2 max-sm:py-2">
            <AppNavbar />
          </div>
          <ScrollShadow
            className="flex h-full w-full flex-col py-6 px-2 main-bg max-sm:mb-12"
            hideScrollBar
            size={8}
          >
            {children}
          </ScrollShadow>
        </div>
      </div>
      <AppBottomBar />
      <SignInModal />
      <ToastWrapper />
    </Providers>
  );
}
