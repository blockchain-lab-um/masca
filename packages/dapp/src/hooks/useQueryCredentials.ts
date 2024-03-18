import { useMascaStore, useToastStore } from '@/stores';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useQuery } from '@tanstack/react-query';

export const useQueryCredentials = () => {
  const api = useMascaStore((state) => state.mascaApi);

  return useQuery({
    queryKey: ['credentials'],
    queryFn: async () => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Loading credentials',
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);

      if (!api) throw new Error('No Masca API instance');

      const credentials = await api.queryCredentials();

      if (isError(credentials)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'Error loading credentials',
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
        return [];
      }

      return credentials.data;
    },
    initialData: [],
  });
};
