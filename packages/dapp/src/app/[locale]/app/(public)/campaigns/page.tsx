'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CampaignsDisplay } from '@/components/CampaignsDisplay';

const queryClient = new QueryClient();

export default function Page() {
  return (
    <div className="flex h-full flex-1 justify-center">
      <QueryClientProvider client={queryClient}>
        <CampaignsDisplay />
      </QueryClientProvider>
    </div>
  );
}
