import AppBottomBar from '@/components/AppBottomBar';
import AppNavbar from '@/components/AppNavbar';
import ConnectedProvider from '@/components/ConnectedProvider';
import MetaMaskProvider from '@/components/MetaMaskProvider';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full px-4 sm:px-12">
      <AppNavbar />
      <div className="flex min-h-screen pb-20 pt-24">
        <div className="flex flex-1 pb-20 pt-20 sm:pb-0">
          <MetaMaskProvider>
            <ConnectedProvider>{children}</ConnectedProvider>
          </MetaMaskProvider>
        </div>
      </div>
      <AppBottomBar />
    </div>
  );
}
