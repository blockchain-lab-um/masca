import ConnectedGateway from '@/components/ConnectedGateway';
import Controlbar from '@/components/Controlbar/Controlbar';
import MetaMaskGateway from '@/components/MetaMaskGateway';
import Title from '@/components/Title';
import Table from '@/components/VCTable';
import { useGeneralStore, useSnapStore } from '@/utils/stores';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useSnapStore((state) => state.vcs);
  return (
    <MetaMaskGateway>
      <div className="flex justify-between items-center">
        <Title>My Credentials</Title>
        <div>
          <span className="text-orange-400 text-md font-cabin font-normal">
            Wallet contains{' '}
          </span>
          <span className="text-md text-orange-500 font-ubuntu font-extrabold">
            {vcs.length}{' '}
          </span>
          <span className="text-orange-400 text-md font-cabin font-normal">
            VC(s)
          </span>
        </div>
      </div>
      <Controlbar vcs={vcs} isConnected={isConnected} />
      <div className="flex justify-center min-h-[50vh] border border-gray-200 bg-white dark:bg-gray-900 dark:shadow-gray-900 dark:border-gray-700 rounded-3xl shadow-lg">
        <ConnectedGateway>
          <Table />
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
}
