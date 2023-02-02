import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from '../../components/MetaMaskGateway';
import { Controlbar } from './Controlbar';
import Table from '../../components/VCTable';
import { useGeneralStore, useSnapStore } from '../../utils/store';
import Title from '../../components/Title';

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
      <div className="flex justify-center min-h-[50vh]  bg-white dark:bg-gray-800 dark:shadow-orange-900 rounded-3xl shadow-lg">
        <ConnectedGateway>
          <Table />
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
}
