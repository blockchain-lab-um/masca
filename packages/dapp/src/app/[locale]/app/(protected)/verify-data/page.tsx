import { Metadata } from 'next';

import VerifyDataDisplay from '@/components/VerifyDataDisplay';

export const metadata: Metadata = {
  title: 'Verify Data',
  description: 'Page for verifying Credentials and Presentations.',
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-md lg:max-w-xl xl:max-w-[40rem]">
        <VerifyDataDisplay />
      </div>
    </div>
  );
}
