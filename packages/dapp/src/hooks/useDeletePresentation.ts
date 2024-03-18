import { useToastStore } from '@/stores';
import { supabaseClient } from '@/utils/supabase/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePresentation = (id: string, token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deletePresentation', id, token],
    mutationFn: async () => {
      useToastStore.setState({
        open: true,
        loading: true,
        type: 'normal',
        text: 'Deleting presentation',
        link: null,
      });

      if (!token) throw new Error('No token');

      const supabase = supabaseClient(token);
      await supabase
        .from('presentations')
        .delete()
        .match({ id })
        .throwOnError();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['presentations'] });

      const previousPresentations = queryClient.getQueryData(['presentations']);

      if (previousPresentations) {
        queryClient.setQueryData(['presentations'], (prev: any) =>
          prev.filter((p: any) => p.id !== id)
        );
      }

      return { previousPresentations };
    },
    onError: (_, __, context) => {
      if (context?.previousPresentations) {
        queryClient.setQueryData(
          ['presentations'],
          context.previousPresentations
        );
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failed to delete presentation',
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    },
    onSuccess: () => {
      useToastStore.setState({
        open: true,
        title: 'Presentation deleted',
        type: 'success',
        loading: false,
        link: null,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
    },
  });
};
