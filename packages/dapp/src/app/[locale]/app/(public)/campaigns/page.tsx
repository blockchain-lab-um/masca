import { CampaignsDisplay } from '@/components/CampaignsDisplay';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Browse campaigns, claim credentials, and earn rewards',
};

export default function Page() {
  return (
    <div className="flex h-full flex-1 justify-center">
      <CampaignsDisplay />
    </div>
  );
}
