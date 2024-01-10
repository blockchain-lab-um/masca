import { Metadata } from 'next';

import { SupabaseProvider } from '@/components/SupabaseProvider';
import { SharedPresentations } from './sharedPresentations';

export const metadata: Metadata = {
  title: 'Shared Presentations',
  description: 'Dashboard for managing shared presentations',
};

export default async function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 h-[65vh] min-h-[65vh] w-full rounded-xl bg-white shadow-lg md:max-w-4xl">
        <SupabaseProvider>
          <SharedPresentations />
        </SupabaseProvider>
      </div>
    </div>
  );
}
