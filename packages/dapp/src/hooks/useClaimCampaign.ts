import { useMutation, useQueryClient } from '@tanstack/react-query';
import { W3CVerifiableCredential } from '@veramo/core';

type ClaimCampaignMutateProps = {
  did: string;
};

export const useClaimCampaign = (id: string, token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['claim-campaign', id, token],
    mutationFn: async ({
      did,
    }: ClaimCampaignMutateProps): Promise<{
      credential: W3CVerifiableCredential;
    }> => {
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

      return {
        credential: json.credential,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
