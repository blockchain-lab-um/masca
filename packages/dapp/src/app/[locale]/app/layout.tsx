import AppNavbar from '@/components/AppNavbar';
import ConnectedProvider from '@/components/ConnectedProvider';
import MetaMaskProvider from '@/components/MetaMaskProvider';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col p-4 sm:p-12">
      <AppNavbar />
      <div className="flex flex-1">
        <MetaMaskProvider>
          <ConnectedProvider>{children}</ConnectedProvider>
        </MetaMaskProvider>
      </div>
    </div>
  );
}
