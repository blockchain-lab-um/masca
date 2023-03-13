import Head from 'next/head';

import ConnectedProvider from '@/components/ConnectedProvider';
import Controlbar from '@/components/Controlbar/Controlbar';
import Title from '@/components/Title';
import Table from '@/components/VCTable';
import { useGeneralStore, useSnapStore } from '@/utils/stores';

export default function Dashboard() {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useSnapStore((state) => state.vcs);
  return (
    <>
      <Head>
        <title>Masca | Dashboard</title>
        <meta name="description" content="Dashboard page for Masca." />
      </Head>
      <div className="flex items-center justify-between">
        <Title>My Credentials</Title>
        <div>
          <span className="text-md font-cabin font-normal text-orange-400">
            Wallet contains:{' '}
          </span>
          <span className="text-md font-ubuntu font-extrabold text-orange-500">
            {vcs.length}{' '}
          </span>
          <span className="text-md font-cabin font-normal text-orange-400">
            VC(s)
          </span>
        </div>
      </div>
      <Controlbar vcs={vcs} isConnected={isConnected} />
      <div className="dark:bg-navy-blue-500 flex min-h-[50vh]  justify-center rounded-3xl bg-white shadow-lg dark:shadow-none">
        <ConnectedProvider>
          <Table />
        </ConnectedProvider>
      </div>
    </>
  );
}
