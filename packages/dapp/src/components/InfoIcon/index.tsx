import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

import Tooltip from '@/components/Tooltip';

interface InfoIconProps {
  children: string;
}

const InfoIcon = ({ children }: InfoIconProps) => {
  return (
    <Tooltip tooltip={children} position="top">
      <InformationCircleIcon className="h-3 w-3" />
    </Tooltip>
  );
};

export default InfoIcon;
