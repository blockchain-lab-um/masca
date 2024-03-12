import React, { useState } from 'react';
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import Button from '../Button';

interface RequirementProps {
  id: string;
  title: string;
  action: string;
  completed: boolean;
  issuer: string;
  types: string[];
  verify: () => Promise<void>;
}

export const Requirement = (props: RequirementProps) => {
  const { title, action, completed, verify } = props;
  const t = useTranslations('CampaignDisplay');
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    await verify();
    setVerifying(false);
  };

  return (
    <div className="mt-8 flex w-full justify-between">
      <h2 className="font-ubuntu dark:text-navy-blue-50 flex items-center gap-x-2 text-lg font-medium leading-6 text-gray-800">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full 
            ${
              completed ? 'bg-green-500' : 'dark:bg-navy-blue-600 bg-gray-300'
            }`}
        >
          {completed && <CheckIcon className="h-5 w-5 text-gray-800" />}
        </div>
        {title}
        <a href={action} target="_blank" rel="noreferrer">
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </a>
      </h2>
      {completed ? (
        <></>
      ) : (
        <div className="flex items-center">
          <Button
            variant="secondary"
            size="2xs"
            onClick={handleVerify}
            loading={verifying}
            disabled={verifying}
          >
            {t('verify')}
          </Button>
        </div>
      )}
    </div>
  );
};
