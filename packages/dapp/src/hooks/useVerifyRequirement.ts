import { useToastStore } from '@/stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VerifiablePresentation } from '@veramo/core';
import { useTranslations } from 'next-intl';

export type VerifyRequirementMutateProps = {
  did: string;
  presentation: VerifiablePresentation;
};

export const useVerifyRequirement = (id: string, token: string | null) => {
  const t = useTranslations('Hooks');
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
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('verification-success'),
            type: 'success',
            loading: false,
            link: null,
          });
        }, 200);

        await queryClient.invalidateQueries({
          queryKey: ['completed_requirements', { token }],
        });
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('requirements-not-met'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    },
    onError: (error) => {
      console.error('Error verifying requirement', error);

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('failed-to-verify-requirements'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    },
  });
};
