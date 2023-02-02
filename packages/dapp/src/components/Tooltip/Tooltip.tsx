import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

export const Tooltip = ({ children, tooltip }: TooltipProps) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute hidden -top-8 left-8 group-hover:inline-block justify-start w-72 animated-transition">
        <div className="overflow-auto font-cabin text-label w-fit text-gray-700 shadow-sm bg-gray-100 py-2 px-4 rounded-full">
          {tooltip}
        </div>
      </div>
    </div>
  );
};
