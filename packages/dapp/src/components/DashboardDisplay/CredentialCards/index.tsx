import React from 'react';
import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';

import { LastFetched } from '../LastFetched';
import VCCard from './VCCard';

interface CredentialCardsProps {
  vcs: QueryCredentialsRequestResult[];
}

export const CredentialCards = ({ vcs }: CredentialCardsProps) => {
  const t = useTranslations('Dashboard');
  return (
    <div className="h-full w-full">
      <div className="dark:border-navy-blue-600 flex items-center justify-between p-9">
        <div className="text-h2 font-ubuntu dark:text-navy-blue-50 pl-4 font-medium text-gray-800">
          {t('table-header.credentials')}
        </div>
        <div className="text-right">
          <div className="text-h4 dark:text-navy-blue-50 text-gray-800">
            {vcs.length} {t('table-header.found')}
          </div>
          <LastFetched />
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {vcs.map((vc, key) => (
          <VCCard key={key} vc={vc} />
        ))}
      </div>
    </div>
  );
};
