import { Metadata } from 'next';

import Controlbar from '@/components/Controlbar/Controlbar';
import DasboardDisplay from '@/components/DashboardDisplay';
import Table from '@/components/VCTable';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Controlbar />
      <div className="dark:bg-navy-blue-800 flex min-h-[65vh] flex-1 items-center justify-center rounded-xl bg-white shadow-lg">
        <DasboardDisplay />
      </div>
    </div>
  );
}
