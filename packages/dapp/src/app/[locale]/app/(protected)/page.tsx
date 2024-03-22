import type { Metadata } from 'next';

import Controlbar from '@/components/Controlbar/Controlbar';
import DashboardDisplay from '@/components/DashboardDisplay';

export const metadata: Metadata = {
  title: 'Credentials',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Controlbar />
      <div className="dark:bg-navy-blue-800 flex flex-1 justify-center rounded-xl bg-white shadow-lg">
        <DashboardDisplay />
      </div>
    </div>
  );
}
