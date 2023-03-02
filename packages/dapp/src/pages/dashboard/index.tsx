import { useGeneralStore, useSnapStore } from '@/utils/stores';

import ConnectedGateway from '@/components/ConnectedGateway';
import MetaMaskGateway from '@/components/MetaMaskGateway';
import Title from '@/components/Title';
import Table from '@/components/VCTable';
import { Controlbar } from './Controlbar';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useSnapStore((state) => state.vcs);
  return (
    <MetaMaskGateway>
      <div className="flex justify-between">
        <Title>My Credentials</Title>
        <div>
          <span className="text-xl font-semibold">{vcs.length} </span>
          <span className="text-gray-80/80 text-lg font-cabin font-normal">
            VCs
          </span>
        </div>
      </div>
      <Controlbar vcs={vcs} isConnected={isConnected} />
      <div className="flex justify-center min-h-[50vh] border border-gray-200 bg-white dark:bg-gray-800 dark:shadow-orange-900 rounded-3xl shadow-lg">
        <ConnectedGateway>
          <Table />
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
}
