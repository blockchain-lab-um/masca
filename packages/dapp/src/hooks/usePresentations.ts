import { supabaseClient } from '@/utils/supabase/supabaseClient';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const ITEMS_PER_PAGE = 10;

const getFromAndTo = (page: number) => {
  const from = page === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  return { from, to };
};

export const usePresentationsOptions = (token: string | null, page: number) =>
  queryOptions({
    queryKey: ['presentations', { token, page }],
    queryFn: async () => {
      if (!token) return { presentations: [] };

      const supabase = supabaseClient(token);

      const { from, to } = getFromAndTo(page);

      const { data } = await supabase
        .from('presentations')
        .select('*')
        .range(from, to)
        .throwOnError();

      return {
        presentations: data ?? [],
      };
    },
    refetchInterval: 30000,
  });

export const usePresentations = (token: string | null, page: number) => {
  return useQuery(usePresentationsOptions(token, page));
};
