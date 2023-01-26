import MetaMaskGateway from '../../components/MetaMaskGateway';
import { Controlbar } from './Controlbar';
import { Table } from './Table';
import { useGeneralStore } from '../../utils/store';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  return (
    <MetaMaskGateway>
      <Controlbar />
      <div className="bg-white min-h-[70vh] p-4 rounded-3xl shadow-lg">
        {isConnected ? (
          <Table />
        ) : (
          <div className="flex justify-center">
            Connect to MetaMask to get started
          </div>
        )}
      </div>
    </MetaMaskGateway>
  );
}
