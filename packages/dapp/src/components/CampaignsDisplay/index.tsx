'use client';

import React from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import { shallow } from 'zustand/shallow';

import { Tables } from '@/utils/supabase/helper.types';
import { useMascaStore, useToastStore, useAuthStore } from '@/stores';
import { Campaign } from './Campaign';

type AddUniqueProperty<T, P extends string, V> = {
  [K in keyof T | P]: K extends keyof T ? T[K] : V;
};
export type Requirements = Tables<'campaign_requirements'>[];
export type Campaigns = AddUniqueProperty<
  Tables<'campaigns'>,
  'campaign_requirements',
  Tables<'campaign_requirements'>[]
>[];
export type CompletedRequirements = { id: string; completed_at: string }[];

interface VERIFYProps {
  id: string;
  types: string[];
  issuer: string;
}

interface RequirementProps {
  id: string;
  title: string;
  action: string;
  issuer: string;
  types: string[];
  verify: () => Promise<boolean>;
}

export const CampaignsDisplay = () => {
  const t = useTranslations('CampaignsDisplay');
  const queryClient = useQueryClient();
  const { token, isSignedIn, changeIsSignInModalOpen } = useAuthStore(
    (state) => ({
      token: state.token,
      isSignedIn: state.isSignedIn,
      changeIsSignInModalOpen: state.changeIsSignInModalOpen,
    }),
    shallow
  );
  const { api, didMethod, did, changeDID, changeCurrDIDMethod } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      didMethod: state.currDIDMethod,
      did: state.currDID,
      changeDID: state.changeCurrDID,
      changeCurrDIDMethod: state.changeCurrDIDMethod,
    }),
    shallow
  );
  const { address } = useAccount();

  if (!token) {
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('please-sign-in'),
        type: 'error',
        loading: false,
        link: null,
      });
    }, 200);
  }

  const VERIFY = async (props: VERIFYProps) => {
    if (!isSignedIn || !token) {
      changeIsSignInModalOpen(true);
      return false;
    }
    if (!api) throw new Error('No Masca API');
    const result = await api?.queryCredentials();

    if (!result || isError(result)) {
      throw new Error(result.error);
    }
    if (result.data.length === 0) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('no-credentials'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return false;
    }

    if (didMethod !== 'did:pkh') {
      const changeMethod = await api?.switchDIDMethod('did:pkh');
      if (!changeMethod || isError(changeMethod)) {
        console.error('error switching did method');
        throw new Error(changeMethod?.error);
      }
      changeCurrDIDMethod('did:pkh');
      changeDID(changeMethod.data);
    }
    if (!did) throw new Error('No DID');

    const presentation = await api?.createPresentation({
      vcs: result?.data.map((vc) => vc.data),
      proofFormat: 'EthereumEip712Signature2021',
    });

    if (!presentation || isError(presentation)) {
      throw new Error(presentation.error);
    }

    const res = await fetch(`/api/campaigns/requirements/verify/${props.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: JSON.stringify({
        presentation: presentation?.data,
        did,
      }),
    });
    if (!res.ok) {
      console.error(res);
      throw new Error(res.statusText);
    }
    const json = await res.json();
    return json.success as boolean;
  };

  const mutation = useMutation({
    mutationFn: VERIFY,
    onSuccess: async (data: boolean, props: VERIFYProps) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: ['completed', address],
        });
      }
    },
    onError: (error) => {
      console.error(error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('verification-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    },
  });

  const requirementsQuery = useQuery({
    queryKey: ['requirements'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns/requirements', {
        cache: 'no-store',
      });
      const json = await res.json();
      const requirements: Record<string, RequirementProps> = {};
      for (const requirement of json as Requirements) {
        requirements[requirement.id] = {
          id: requirement.id,
          title: requirement.name!,
          action: requirement.action_link!,
          issuer: requirement.issuer!,
          types: requirement.types!,
          verify: async () => {
            return await mutation.mutateAsync({
              id: requirement.id,
              types: requirement.types!,
              issuer: requirement.issuer!,
            });
          },
        };
      }
      return requirements;
    },
  });

  const campaignsQuery = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns', { cache: 'no-store' });
      const json = await res.json();
      return json as Campaigns;
    },
    enabled: !requirementsQuery.isLoading,
  });

  const completedQuery = useQuery({
    queryKey: ['completed', address],
    queryFn: async () => {
      const res = await fetch('/api/campaigns/user/requirements', {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        cache: 'no-store',
      });
      const json = await res.json();
      return json.completed as CompletedRequirements;
    },
    enabled: !campaignsQuery.isLoading && !!token,
  });

  if (campaignsQuery.isLoading) return <div>Loading...</div>;
  if (campaignsQuery.isError) return <div>{campaignsQuery.error.message}</div>;

  return (
    <div className="flex w-3/4 flex-col gap-y-4">
      {campaignsQuery.data?.map((campaign) => (
        <Campaign
          key={campaign.id}
          id={campaign.id}
          title={campaign.title!}
          description={campaign.description!}
          claimed={campaign.claimed!}
          total={campaign.total!}
          imageUrl={campaign.image_url!}
          requirements={
            campaign.campaign_requirements
              .map((requirement) => requirementsQuery?.data?.[requirement.id])
              .filter(
                (requirement): requirement is RequirementProps =>
                  requirement !== undefined
              ) ?? []
          }
          completedRequirements={completedQuery.data ?? []}
        />
      ))}
    </div>
  );
};
