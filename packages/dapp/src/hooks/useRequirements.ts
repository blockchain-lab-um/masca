import { Tables } from '@/utils/supabase/database.types';
import { useQuery } from '@tanstack/react-query';

export type Requirements = Tables<'requirements'>[];

export const useRequirements = () => {
  return useQuery({
    queryKey: ['requirements'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns/requirements', {
        cache: 'no-store',
      });

      const json = await res.json();

      return {
        requirements: json.requirements as Requirements,
      };
    },
  });
};
