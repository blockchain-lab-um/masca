import { Metadata } from 'next';

import { SupabaseProvider } from '@/components/SupabaseProvider';
import { SharedPresentations } from './shared-presentations';

export const metadata: Metadata = {
  title: 'Shared Presentations',
  description: 'Dashboard for managing shared presentations',
};

export default async function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full md:max-w-4xl">
        <SupabaseProvider>
          <SharedPresentations />
        </SupabaseProvider>
      </div>
    </div>
  );
}
