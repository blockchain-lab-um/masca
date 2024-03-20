import { useMascaStore, useToastStore } from '@/stores';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export const useQueryCredentials = () => {
  const t = useTranslations('Hooks');
  const api = useMascaStore((state) => state.mascaApi);

  return useQuery({
    queryKey: ['credentials'],
    queryFn: async () => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('loading-credentials'),
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
            title: t('failed-to-load-credentials'),
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
