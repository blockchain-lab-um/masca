import type { Metadata } from 'next';

import EncryptedSessionDisplay from '@/components/EncryptedSessionDisplay';

export const metadata: Metadata = {
  title: 'Encrypted Session',
  description: 'Encrypted Session for Masca.',
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-4xl">
        <EncryptedSessionDisplay />
      </div>
    </div>
  );
}
