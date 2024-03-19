import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VerifiablePresentation } from '@veramo/core';

export type VerifyRequirementMutateProps = {
  did: string;
  presentation: VerifiablePresentation;
};

export const useVerifyRequirement = (id: string, token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['verifyRequirement', { id, token }],
    mutationFn: async (
      values: VerifyRequirementMutateProps
    ): Promise<{ success: boolean }> => {
      if (!token) throw new Error('No token');

      const { presentation, did } = values;

      const res = await fetch(`/api/campaigns/requirements/verify/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          presentation,
          did,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();

      return { success: json.success };
    },
    onSuccess: async ({ success }) => {
      if (success) {
        await queryClient.invalidateQueries({
          queryKey: ['completed_requirements', { token }],
        });
      }
    },
  });
};
