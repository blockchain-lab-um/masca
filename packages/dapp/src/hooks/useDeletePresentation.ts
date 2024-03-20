import { useToastStore } from '@/stores';
import { supabaseClient } from '@/utils/supabase/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePresentationsOptions } from './usePresentations';
import { useTranslations } from 'next-intl';

export type DeletePresentationMuateProps = {
  id: string;
  page: number;
};

export const useDeletePresentation = (token: string | null) => {
  const t = useTranslations('Hooks');
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deletePresentation', { token }],
    mutationFn: async ({ id }: DeletePresentationMuateProps) => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          loading: true,
          type: 'normal',
          title: t('deleting-presentation'),
          link: null,
        });
      }, 200);

      if (!token) throw new Error('No token');

      const supabase = supabaseClient(token);

      await supabase
        .from('presentations')
        .delete()
        .match({ id })
        .throwOnError();
    },
    onMutate: async ({ id, page }) => {
      const presentationsOptions = usePresentationsOptions(token, page);

      await queryClient.cancelQueries({
        queryKey: ['presentations', { token }],
      });

      const previousPresentations = queryClient.getQueryData(
        presentationsOptions.queryKey
      );

      if (previousPresentations) {
        queryClient.setQueryData(presentationsOptions.queryKey, (prev) => ({
          ...prev,
          presentations: prev
            ? prev.presentations.filter((p: any) => p.id !== id)
            : [],
        }));
      }

      return { previousPresentations };
    },
    onError: (_, { page }, context) => {
      if (context?.previousPresentations) {
        queryClient.setQueryData(
          ['presentations', { token, page }],
          context.previousPresentations
        );
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('failed-to-delete-presentation'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    },
    onSuccess: () => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('presentation-deleted'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['presentations', { token }],
      });
    },
  });
};
