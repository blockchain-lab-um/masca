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
      <div className="flex flex-col gap-y-4">
        <h5 className="font-ubuntu dark:text-navy-blue-200 mt-8 text-2xl font-medium leading-6 text-gray-700">
          {t('title')}
        </h5>
        <p className="text-justify">{t('description')}</p>
      </div>
      {campaigns.map((campaign) => (
        <CampaignDisplay key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};
