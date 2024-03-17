import { Tables } from '@/utils/supabase/database.types';
import { useQuery } from '@tanstack/react-query';

type AddUniqueProperty<T, P extends string, V> = {
  [K in keyof T | P]: K extends keyof T ? T[K] : V;
};
export type Campaigns = AddUniqueProperty<
  Tables<'campaigns'>,
  'campaign_requirements',
  Tables<'campaign_requirements'>[]
>[];

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns', { cache: 'no-store' });
      const json = await res.json();

      return {
        campaigns: json.campaigns as Campaigns,
      };
    },
    initialData: {
      campaigns: [],
    },
  });
};
