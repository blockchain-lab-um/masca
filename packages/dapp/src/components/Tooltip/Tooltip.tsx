import React from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({
  children,
  tooltip,
  position = 'top',
}: TooltipProps) => {
  return (
    <div id="tooltip" className="relative cursor-pointer group">
      {children}
      <div className="opacity-0 group-hover:opacity-100 transition duration-500">
        <span
          className={clsx(
            'absolute whitespace-nowrap z-20 invisible group-hover:visible  bg-navy-blue-600 text-gray-100 py-1 px-2 rounded-lg text-sm',
            position === 'top'
              ? 'left-1/2 -translate-x-1/2 bottom-[calc(100%+5px)]'
              : '',
            position === 'bottom'
              ? 'left-1/2 -translate-x-1/2 top-[calc(100%+5px)]'
              : '',
            position === 'left'
              ? 'top-1/2 -translate-y-1/2 right-[calc(100%+3px)]'
              : '',
            position === 'right'
              ? 'top-1/2 -translate-y-1/2 left-[calc(100%+3px)]'
              : ''
          )}
        >
          {tooltip}
        </span>
        <span
          className={clsx(
            'absolute invisible group-hover:visible z-10 w-3 h-3 bg-navy-blue-600  rotate-45',
            position === 'top' ? 'left-1/2 -translate-x-1/2 bottom-full' : '',
            position === 'bottom' ? 'left-1/2 -translate-x-1/2 top-full' : '',
            position === 'left' ? 'top-1/2 -translate-y-1/2 right-full' : '',
            position === 'right' ? 'top-1/2 -translate-y-1/2 left-full' : ''
          )}
        ></span>
      </div>
    </div>
  );
};
