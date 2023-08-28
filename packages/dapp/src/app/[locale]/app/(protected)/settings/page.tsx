import { Metadata } from 'next';

import SettingsCard from '@/components/SettingsCard';

export const metadata: Metadata = {
  title: 'Settings',
  description: "Settings page for changing Masca's configuration.",
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-4xl">
        <SettingsCard />
      </div>
    </div>
  );
}
