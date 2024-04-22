import type { Tables } from '@/utils/supabase/database.types';
import { useQuery } from '@tanstack/react-query';

type AddUniqueProperty<T, P extends string, V> = {
  [K in keyof T | P]: K extends keyof T ? T[K] : V;
};

export type Campaign = AddUniqueProperty<
  Tables<'campaigns'>,
  'requirements',
  Tables<'requirements'>[]
>;
export type Claim = Tables<'claims'>;
export type Claims = Claim[];

export type Campaigns = Campaign[];

export const useCampaignClaims = (token: string | null) => {
  return useQuery({
    queryKey: ['claims'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch('/api/campaigns/claims', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: 'no-store',
      });
      const json = await res.json();

      return {
        claims: json.claims as Claims,
      };
    },
  });
};
