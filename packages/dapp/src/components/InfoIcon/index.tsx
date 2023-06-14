import { InformationCircleIcon } from '@heroicons/react/20/solid';

import Tooltip from '@/components/Tooltip';

interface InfoIconProps {
  children: string;
}

const InfoIcon = ({ children }: InfoIconProps) => (
  <Tooltip tooltip={children} position="top">
    <InformationCircleIcon className="h-3.5 w-3.5" />
  </Tooltip>
);

export default InfoIcon;
