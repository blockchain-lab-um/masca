import { Metadata } from 'next';

import { SupabaseProvider } from '@/components/SupabaseProvider';
import { Identities } from './identities';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard page for extra features.',
};

export default async function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-4xl">
        <SupabaseProvider>
          {/* TODO: Shared Credential Management */}
          <Identities />
        </SupabaseProvider>
      </div>
    </div>
  );
}
