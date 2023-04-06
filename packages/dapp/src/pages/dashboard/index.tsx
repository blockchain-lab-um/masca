import Head from 'next/head';

import ConnectedProvider from '@/components/ConnectedProvider';
import Controlbar from '@/components/Controlbar/Controlbar';
import Table from '@/components/VCTable';
import { useGeneralStore, useSnapStore } from '@/utils/stores';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useSnapStore((state) => state.vcs);
  return (
    <div className="">
      <Head>
        <title>Masca | Dashboard</title>
        <meta name="description" content="Dashboard page for Masca." />
      </Head>

      <Controlbar vcs={vcs} isConnected={isConnected} />
      <div className="dark:bg-navy-blue-800 flex min-h-[50vh] justify-center rounded-3xl bg-white shadow-lg">
        <ConnectedProvider>
          <Table />
        </ConnectedProvider>
      </div>
    </div>
  );
}
