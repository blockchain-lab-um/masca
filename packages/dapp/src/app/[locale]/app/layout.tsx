import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import CheckMetaMaskCompatibility from '@/components/CheckMetaMaskCompatibility';
import QRCodeSessionProvider from '@/components/QRCodeSessionProvider';
import ToastWrapper from '@/components/ToastWrapper';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col px-4 sm:px-12">
      <AppNavbar />
      <div className="flex w-full flex-1 pb-14 pt-24 md:pb-0">
        <div className="flex h-full flex-1 pb-4 pt-4 sm:pb-10 sm:pt-10 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20">
          <CheckMetaMaskCompatibility />
          {children}
        </div>
      </div>
      <AppBottomBar />
      <ToastWrapper />
      <QRCodeSessionProvider />
    </div>
  );
}
