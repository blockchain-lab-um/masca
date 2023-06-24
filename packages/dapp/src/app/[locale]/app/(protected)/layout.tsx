import ConnectedProvider from '@/components/ConnectedProvider';
import MetaMaskProvider from '@/components/MetaMaskProvider';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MetaMaskProvider>
      <ConnectedProvider>{children}</ConnectedProvider>
    </MetaMaskProvider>
  );
}
