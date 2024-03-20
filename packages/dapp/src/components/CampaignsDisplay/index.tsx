'use client';

import React from 'react';
import { CampaignDisplay } from './CampaignDisplay';
import { useCampaigns } from '@/hooks';
import { Spinner } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

export const CampaignsDisplay = () => {
  const t = useTranslations('CampaignsDisplay');
  const { data, status } = useCampaigns();

  if (status === 'pending') {
    return (
      <div className="flex items-center">
        <Spinner />
      </div>
    );
  }

  const campaigns = data?.campaigns || [];

  if (campaigns.length === 0) {
    return <div className="flex items-center">{t('no-campaigns')}</div>;
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-y-4">
      {campaigns.map((campaign) => (
        <CampaignDisplay key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};
