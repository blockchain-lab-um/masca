import { Tooltip } from '@nextui-org/react';

export const DisplayText = ({
  text,
  value,
  tooltip,
}: { text: string; value: string; tooltip?: string }) => (
  <div className="flex flex-col items-start space-y-0.5">
    <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
      {text}:
    </h2>
    {tooltip ? (
      <Tooltip
        content={tooltip}
        className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
      >
        <h3 className="text-md dark:text-navy-blue-200 text-gray-700">
          {value}
        </h3>
      </Tooltip>
    ) : (
      <h3 className="text-md dark:text-navy-blue-200 text-gray-700">{value}</h3>
    )}
  </div>
);
