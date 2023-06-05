import { Metadata } from 'next';

import ConnectedProvider from '@/components/ConnectedProvider';
import SettingsCard from '@/components/SettingsCard';

export const metadata: Metadata = {
  title: 'Settings',
  description: "Settings page for changing Masca's configuration.",
};

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="dark:bg-navy-blue-800 flex min-h-[40vh] w-full max-w-sm flex-col justify-center rounded-3xl bg-white shadow-lg  md:max-w-md lg:max-w-lg  xl:w-[34rem] xl:max-w-[34rem]">
        <ConnectedProvider>
          <SettingsCard />
        </ConnectedProvider>
      </div>
    </div>
  );
}
