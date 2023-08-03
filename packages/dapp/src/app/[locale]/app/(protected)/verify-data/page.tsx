import { Metadata } from 'next';

import SettingsCard from '@/components/SettingsCard';

export const metadata: Metadata = {
  title: 'Verify Data',
  description: 'Page for verifying Credentials and Presentations.',
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 w-full max-w-sm flex-col justify-center rounded-3xl bg-white shadow-lg md:max-w-md lg:max-w-lg xl:max-w-[34rem]">
        <SettingsCard />
      </div>
    </div>
  );
}
