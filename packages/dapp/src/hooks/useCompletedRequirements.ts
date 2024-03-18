import { useQuery } from '@tanstack/react-query';

export type CompletedRequirements = { id: string; completed_at: string }[];

export const useCompletedRequirements = (token: string | null) => {
  return useQuery({
    queryKey: ['completed_requirements', token],
    queryFn: async () => {
      if (!token) return { completedRequirements: [] };

      const res = await fetch('/api/campaigns/user/requirements', {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();

      return {
        completedRequirements: json.completed as string[],
      };
    },
  });
};
