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
      <div className="flex justify-between mb-2">
        <Title>My Credentials</Title>
        {isConnected && (
          <div>
            <span className="text-xl font-semibold">{vcs.length} </span>
            <span className="text-gray-80/80 text-lg font-cabin font-normal">
              VCs
            </span>
          </div>
        )}
      </div>
      {vcs.length > 0 && <Controlbar />}
      <div className="bg-white dark:bg-gray-80 dark:shadow-orange-20/10 h-[70vh] p-4 rounded-3xl shadow-lg">
        {isConnected ? (
          <Table />
        ) : (
          <div className="flex justify-center h-full">
            Connect to MetaMask to get started
          </div>
        )}
      </div>
    </MetaMaskGateway>
  );
}
