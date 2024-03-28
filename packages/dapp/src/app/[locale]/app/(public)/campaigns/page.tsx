import { CampaignsDisplay } from '@/components/CampaignsDisplay';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Browse campaigns, claim credentials, and earn rewards',
};

export default function Page() {
  return (
    <div className="flex h-full justify-center w-full">
      <CampaignsDisplay />
    </div>
  );
}
