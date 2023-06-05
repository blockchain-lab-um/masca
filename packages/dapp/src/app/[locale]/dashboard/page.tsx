import { Metadata } from 'next';

import ConnectedProvider from '@/components/ConnectedProvider';
import Controlbar from '@/components/Controlbar/Controlbar';
import Table from '@/components/VCTable';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return (
    <div className="">
      <Controlbar />
      <div className="dark:bg-navy-blue-800 flex min-h-[50vh] justify-center rounded-3xl bg-white shadow-lg">
        <ConnectedProvider>
          <Table />
        </ConnectedProvider>
      </div>
    </div>
  );
}
