import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { W3CVerifiableCredential } from '@veramo/core';
import { useSaveCredential } from './useSaveCredential';
import { useToastStore } from '@/stores';

type ClaimCampaignMutateProps = {
  did: string;
};

export const useClaimCampaign = (id: string, token: string | null) => {
  const queryClient = useQueryClient();
  const { mutateAsync: saveCredential } = useSaveCredential();

  return useMutation({
    mutationKey: ['claim-campaign', { id, token }],
    mutationFn: async ({
      did,
    }: ClaimCampaignMutateProps): Promise<{
      credential: W3CVerifiableCredential;
    }> => {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Claiming campaign',
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);

      if (!token) throw new Error('No token');

      const response = await fetch('/api/campaigns/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: id, did }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const json = await response.json();

      await saveCredential(json.credential);

      return {
        credential: json.credential,
      };
    },
    onError: (error) => {
      console.error(error);
      useToastStore.setState({
        open: true,
        title: 'Error claiming campaign',
        type: 'error',
        loading: false,
        link: null,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
