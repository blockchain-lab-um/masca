import React from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({ children, tooltip, position = 'top' }: TooltipProps) => {
  return (
    <div id="tooltip" className="group relative cursor-pointer">
      {children}
      <div className="opacity-0 transition duration-500 group-hover:opacity-100">
        <span
          className={clsx(
            'bg-navy-blue-600 invisible absolute z-20 whitespace-nowrap rounded-lg py-1 px-2 text-sm text-gray-100 group-hover:visible',
            position === 'top'
              ? 'left-1/2 bottom-[calc(100%+5px)] mb-1 -translate-x-1/2'
              : '',
            position === 'bottom'
              ? 'left-1/2 top-[calc(100%+5px)] mt-1 -translate-x-1/2'
              : '',
            position === 'left'
              ? 'top-1/2 right-[calc(100%+3px)] mr-1 -translate-y-1/2'
              : '',
            position === 'right'
              ? 'top-1/2 left-[calc(100%+3px)] ml-1 -translate-y-1/2'
              : ''
          )}
        >
          {tooltip}
        </span>
        <span
          className={clsx(
            'bg-navy-blue-600 invisible absolute z-10 h-3 w-3 rotate-45  group-hover:visible',
            position === 'top'
              ? 'left-1/2 bottom-full mb-1 -translate-x-1/2'
              : '',
            position === 'bottom'
              ? 'left-1/2 top-full mt-1 -translate-x-1/2'
              : '',
            position === 'left'
              ? 'top-1/2 right-full mr-1 -translate-y-1/2'
              : '',
            position === 'right'
              ? 'top-1/2 left-full ml-1 -translate-y-1/2'
              : ''
          )}
        ></span>
      </div>
    </div>
  );
};

export default Tooltip;
