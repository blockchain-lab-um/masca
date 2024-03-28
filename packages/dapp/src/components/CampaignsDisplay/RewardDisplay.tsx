import { Chip } from '@nextui-org/react';

type RequirementProps = {
  reward: string;
};

export const RewardDisplay = ({ reward }: RequirementProps) => {
  return (
    <div className="mt-8 flex w-full justify-between">
      <Chip>
        <h2 className="font-ubuntu dark:text-navy-blue-50 flex items-center gap-x-2 text-lg font-medium leading-6 text-gray-800">
          {reward}
        </h2>
      </Chip>
    </div>
  );
};
