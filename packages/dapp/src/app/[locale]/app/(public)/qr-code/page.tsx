import { Metadata } from 'next';

import CreateConnectionCard from '@/components/CreateConnectionCard';
import ScanConnectionCard from '@/components/ScanConnectionCard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
      <div className="dark:bg-navy-blue-800 flex flex-1 rounded-3xl bg-white p-4 shadow-lg">
        <CreateConnectionCard />
      </div>
      <div className="dark:bg-navy-blue-800 flex flex-1 rounded-3xl bg-white p-4 shadow-lg">
        <ScanConnectionCard />
      </div>
    </div>
  );
}
