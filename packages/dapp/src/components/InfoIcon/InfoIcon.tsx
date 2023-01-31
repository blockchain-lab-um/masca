import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

interface InfoIconProps {
  children: React.ReactNode;
}

export const InfoIcon = ({ children }: InfoIconProps) => {
  return (
    <div className="group relative">
      <InformationCircleIcon className="w-3 h-3" />
      <div className="absolute hidden -top-8 -left-5 group-hover:inline-block justify-start w-72 animated-transition">
        <div className="overflow-auto font-cabin text-label w-fit text-gray-600 shadow-sm bg-gray-100 py-2 px-4 rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
};
