import { useMascaStore, useToastStore } from '@/stores';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { W3CVerifiableCredential } from '@veramo/core';

// TODO: Optimistic update
export const useSaveCredential = () => {
  const queryClient = useQueryClient();
  const api = useMascaStore((state) => state.mascaApi);

  return useMutation({
    mutationKey: ['save-credential'],
    mutationFn: async (credential: W3CVerifiableCredential) => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Saving credential',
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);

      if (!api) throw new Error('No Masca API instance');

      const saveCredentialResult = await api.saveCredential(credential);

      if (isError(saveCredentialResult)) {
        throw new Error(saveCredentialResult.error);
      }
    },
    onError: (error) => {
      console.error(error);
      useToastStore.setState({
        open: true,
        title: 'Error saving credential',
        type: 'error',
        loading: false,
        link: null,
      });
    },
    onSuccess: () => {
      useToastStore.setState({
        open: true,
        title: 'Credential saved',
        type: 'success',
        loading: false,
        link: null,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
};
