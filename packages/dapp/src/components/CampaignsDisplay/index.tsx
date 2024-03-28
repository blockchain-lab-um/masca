'use client';

import React from 'react';
import { CampaignDisplay } from './CampaignDisplay';
import { useCampaigns } from '@/hooks';
import { Spinner } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores';
import { shallow } from 'zustand/shallow';
import { useCampaignClaims } from '@/hooks/useCampaignClaims';

export const CampaignsDisplay = () => {
  const t = useTranslations('CampaignsDisplay');

  const { data, status } = useCampaigns();
  const campaigns = data?.campaigns || [];
  const { token } = useAuthStore(
    (state) => ({
      token: state.token,
      isSignedIn: state.isSignedIn,
      changeIsSignInModalOpen: state.changeIsSignInModalOpen,
    }),
    shallow
  );
  const { data: claimsData } = useCampaignClaims(token);

  if (campaigns.length === 0) {
    return <div className="flex items-center">{t('no-campaigns')}</div>;
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full max-w-4xl flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <h5 className="font-ubuntu dark:text-navy-blue-200 mt-8 text-2xl font-medium leading-6 text-gray-700">
          {t('title')}
        </h5>
        <p className="text-justify">{t('description')}</p>
      </div>
      {campaigns.map((campaign) => (
        <div className="pb-2">
          <CampaignDisplay
            key={campaign.id}
            campaign={campaign}
            alreadyClaimed={
              !!claimsData?.claims?.find(
                (claim) => claim.campaign_id === campaign.id
              )
            }
          />
        </div>
      ))}
    </div>
  );
};
