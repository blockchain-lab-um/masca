import MetaMaskGateway from '../../components/MetaMaskGateway';
import { Controlbar } from './Controlbar';
import { Table } from './Table';
import { useGeneralStore, useSnapStore } from '../../utils/store';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useSnapStore((state) => state.vcs);
  return (
    <MetaMaskGateway>
      {vcs.length > 0 && <Controlbar />}
      <div className="bg-white h-[70vh] p-4 rounded-3xl shadow-lg">
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
