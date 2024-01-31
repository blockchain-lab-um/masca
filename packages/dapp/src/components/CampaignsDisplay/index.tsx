import React, { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Campaign } from './Campaign';
import { Requirement } from './Requirement';

const CAMPAIGN = [
  {
    id: 1,
    title: 'Ethereum Merge',
    description:
      'The Ethereum Merge is the first step in the transition from Proof of Work to Proof of Stake.',
    claimed: 135,
    total: 1000,
    image_url: 'https://i.imgur.com/sduLRvf.jpeg',
    requirements: [1],
  },
  {
    id: 2,
    title: 'Ethereum Merge 2',
    description:
      'The Ethereum Merge is the first step in the transition from Proof of Work to Proof of Stake.',
    claimed: 135,
    total: 1000,
    image_url: 'https://i.imgur.com/sduLRvf.jpeg',
    requirements: [1, 2],
  },
];

const REQUIREMENTS = [
  {
    id: 1,
    name: 'Holder of Masca User Credential',
    action_link: 'https://www.masca-project.eu/',
    issuer: 'Masca Project',
    types: ['Masca User Credential'],
  },
  {
    id: 2,
    name: 'Holder of Masca2 User Credential',
    action_link: 'https://www.masca-project.eu/',
    issuer: 'Masca Project',
    types: ['Masca User Credential'],
  },
];

const address = '0x123';

const COMPLETED = [1];

interface VERIFYProps {
  id: number;
  types: string[];
  issuer: string;
}

const VERIFY = async (props: VERIFYProps) => {
  console.log('verify');
  console.log(props);
  return Promise.resolve(true);
};

export const CampaignsDisplay = () => {
  const queryClient = useQueryClient();
  // Get campaigns from the backend

  // Maybe move campaignsQuery to the last place (after requirementsQuery and completedQuery)
  const campaignsQuery = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => CAMPAIGN,
  });
  const requirementsQuery = useQuery({
    queryKey: ['requirements'],
    queryFn: () => REQUIREMENTS,
    enabled: campaignsQuery.status === 'success',
  });
  const completedQuery = useQuery({
    queryKey: ['completed', address],
    queryFn: ({ queryKey }) => {
      console.log(queryKey[1]);
      return COMPLETED;
    },
    enabled: requirementsQuery.status === 'success',
  });

  const mutation = useMutation({
    mutationFn: VERIFY,
    onSuccess: () => {
      queryClient.setQueryData(['completed', address], [...COMPLETED, 2]);
      queryClient.invalidateQueries({ queryKey: ['completed', address] });
    },
  });

  // Prepare requirements array
  const requirements: Record<string, ReactNode> = {};
  if (
    requirementsQuery.status === 'success' &&
    completedQuery.status === 'success'
  ) {
    requirementsQuery.data?.forEach((requirement) => {
      requirements[requirement.id] = (
        <Requirement
          key={requirement.id}
          id={requirement.id}
          title={requirement.name}
          action={requirement.action_link}
          issuer={requirement.issuer}
          types={requirement.types}
          verify={() =>
            mutation.mutateAsync({
              id: requirement.id,
              types: requirement.types,
              issuer: requirement.issuer,
            })
          }
          completed={completedQuery.data?.includes(requirement.id) ?? false}
        />
      );
    });
  }

  if (campaignsQuery.status === 'pending') return <div>Loading...</div>;
  if (campaignsQuery.status === 'error')
    return <div>{campaignsQuery.error.message}</div>;

  return (
    <div>
      {campaignsQuery.data?.map((campaign, id) => (
        <Campaign
          key={campaign.id}
          id={campaign.id}
          title={campaign.title}
          description={campaign.description}
          claimed={campaign.claimed}
          total={campaign.total}
          image_url={campaign.image_url}
          requirements={
            campaign.requirements.map(
              (requirement: number) => requirements[requirement]
            ) ?? []
          }
        />
      ))}
    </div>
  );
};
