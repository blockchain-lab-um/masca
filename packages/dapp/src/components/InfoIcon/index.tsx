import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { Tooltip } from '@nextui-org/react';

const InfoIcon = ({ content }: { content: string }) => (
  <Tooltip
    content={content}
    className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
  >
    <InformationCircleIcon className="h-3.5 w-3.5" />
  </Tooltip>
);

export default InfoIcon;
