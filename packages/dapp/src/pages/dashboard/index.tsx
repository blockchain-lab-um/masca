import Head from 'next/head';
import { useGeneralStore, useSnapStore } from '@/stores';

import ConnectedProvider from '@/components/ConnectedProvider';
import Controlbar from '@/components/Controlbar/Controlbar';
import Table from '@/components/VCTable';

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

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
