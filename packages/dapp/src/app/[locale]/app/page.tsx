import { Metadata } from 'next';

import Controlbar from '@/components/Controlbar/Controlbar';
import Table from '@/components/VCTable';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Controlbar />
      <div className="dark:bg-navy-blue-800 flex flex-1 items-center justify-center rounded-3xl bg-white shadow-lg">
        <Table />
      </div>
    </div>
  );
}
