import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import CheckMetaMaskCompatibility from '@/components/CheckMetaMaskCompatibility';
import ToastWrapper from '@/components/ToastWrapper';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full px-4 sm:px-12">
      <AppNavbar />
      <div className="flex min-h-screen pb-14 pt-24 md:pb-0">
        <div className="flex flex-1 pb-4 pt-4 sm:pb-10 sm:pt-10 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20">
          <CheckMetaMaskCompatibility />
          {children}
        </div>
      </div>
      <AppBottomBar />
      <ToastWrapper />
    </div>
  );
}
