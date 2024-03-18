import { supabaseClient } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export const ITEMS_PER_PAGE = 10;

const getFromAndTo = (page: number) => {
  const from = page === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  return { from, to };
};

export const usePresentations = (token: string, page: number) => {
  return useQuery({
    queryKey: ['presentations', token, page],
    queryFn: async () => {
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
};
