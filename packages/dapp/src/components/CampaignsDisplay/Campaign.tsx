import React, { useMemo } from 'react';
import Image from 'next/image';

import Button from '../Button';
import { Requirement } from './Requirement';

interface RequirementProps {
  id: number;
  title: string;
  action: string;
  completed: boolean;
  issuer: string;
  types: string[];
  verify: () => Promise<void>;
}

interface CampaignProps {
  id: number;
  title: string;
  description: string;
  claimed: number;
  total: number;
  image_url: string;
  requirements: RequirementProps[];
}

export const Campaign = (props: CampaignProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { title, description, claimed, total, image_url, requirements } = props;

  const disabled = useMemo(
    () => !requirements.every((requirement) => requirement.completed),
    [requirements]
  );

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex rounded-3xl bg-white shadow-md">
      <div className="dark:border-navy-blue-700 hidden w-1/4 items-center justify-center border-r-4 border-gray-100 md:flex">
        <div className="dark:ring-navy-blue-700 relative h-[96px] w-[96px] overflow-hidden  rounded-full ring-4 ring-gray-200 lg:h-[128px] lg:w-[128px]">
          <Image src={image_url} fill={true} alt="campaign" />
        </div>
      </div>

      <div className="w-full px-8 py-4">
        <div className="w-full">
          <h2 className="font-ubuntu dark:text-navy-blue-50 text-2xl font-medium leading-6 text-gray-800">
            {title}
          </h2>
          <p className="text-md dark:text-navy-blue-400 mt-4 text-gray-600">
            {description}
          </p>

          <h5 className="font-ubuntu dark:text-navy-blue-200 mt-8 text-lg font-medium leading-6 text-gray-700">
            Requirements
          </h5>
        </div>
        <div className="mt-2 w-full">
          {requirements.map((requirement: RequirementProps) => (
            <Requirement
              key={requirement.id}
              id={requirement.id}
              title={requirement.title}
              action={requirement.action}
              issuer={requirement.issuer}
              types={requirement.types}
              verify={requirement.verify}
              completed={requirement.completed}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm">
            {claimed}/{total} claimed
          </p>
          <Button variant="primary" size="sm" disabled={disabled}>
            Claim
          </Button>
        </div>
      </div>
    </div>
  );
};
