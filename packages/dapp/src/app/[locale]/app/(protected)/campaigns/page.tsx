'use client';

// import { Metadata } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CampaignsDisplay } from '@/components/CampaignsDisplay';

// export const metadata: Metadata = {
//   title: 'Campaigns',
//   description: 'Masca Credential Campaigns.',
// };

const queryClient = new QueryClient();

export default function Page() {
  return (
    <div className="flex justify-center flex-1 h-full">
      <QueryClientProvider client={queryClient}>
        <CampaignsDisplay />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}
