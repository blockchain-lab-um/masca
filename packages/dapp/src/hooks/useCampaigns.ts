import { Tables } from '@/utils/supabase/database.types';
import { useQuery } from '@tanstack/react-query';

type AddUniqueProperty<T, P extends string, V> = {
  [K in keyof T | P]: K extends keyof T ? T[K] : V;
};

export type Campaign = AddUniqueProperty<
  Tables<'campaigns'>,
  'requirements',
  Tables<'requirements'>[]
>;

export type Campaigns = Campaign[];

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
  });
};
