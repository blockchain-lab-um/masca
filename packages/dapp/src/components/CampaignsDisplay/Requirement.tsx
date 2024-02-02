import React from 'react';
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

import Button from '../Button';

interface RequirementProps {
  id: number;
  title: string;
  action: string;
  completed: boolean;
  issuer: string;
  types: string[];
  verify: () => Promise<void>;
}

export const Requirement = (props: RequirementProps) => {
  const { title, action, completed, issuer, types, verify } = props;

  return (
    <div className="flex justify-between w-full mt-8">
      <h2 className="flex items-center text-lg font-medium leading-6 text-gray-800 font-ubuntu dark:text-navy-blue-50 gap-x-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            completed ? 'bg-green-500' : 'dark:bg-navy-blue-600 bg-gray-300'
          }`}
        >
          {completed && <CheckIcon className="w-5 h-5 text-gray-800" />}
        </div>
        {title}
        <a href={action} target="_blank">
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </a>
      </h2>
      {completed ? (
        <></>
      ) : (
        <div className="flex items-center">
          <Button variant="secondary" size="2xs" onClick={verify}>
            Verify
          </Button>
        </div>
      )}
    </div>
  );
};
