import { supabaseClient } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export const useTotalPresentations = (token: string) => {
  return useQuery({
    queryKey: ['presentations', { token, total: true }],
    queryFn: async () => {
      const supabase = supabaseClient(token);

      const { count } = await supabase
        .from('presentations')
        .select('id', {
          count: 'exact',
        })
        .throwOnError();

      return {
        total: count ?? 1,
      };
    },
    initialData: {
      total: 1,
    },
  });
};
