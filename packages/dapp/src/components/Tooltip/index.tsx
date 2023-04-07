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
            'dark:border-navy-blue-300 dark:bg-navy-blue-100 dark:text-navy-blue-700 text-md invisible absolute z-20 whitespace-nowrap rounded-lg border border-blue-300 bg-blue-100 px-2 py-1 text-blue-700 group-hover:visible',
            position === 'top'
              ? 'bottom-[calc(100%+5px)] left-1/2 mb-1 -translate-x-1/2'
              : '',
            position === 'bottom'
              ? 'left-1/2 top-[calc(100%+5px)] mt-1 -translate-x-1/2'
              : '',
            position === 'left'
              ? 'right-[calc(100%+3px)] top-1/2 mr-1 -translate-y-1/2'
              : '',
            position === 'right'
              ? 'left-[calc(100%+3px)] top-1/2 ml-1 -translate-y-1/2'
              : ''
          )}
        >
          {tooltip}
        </span>
        <span
          className={clsx(
            'dark:bg-navy-blue-300 invisible absolute z-10 h-3 w-3 rotate-45 bg-blue-300 group-hover:visible',
            position === 'top'
              ? 'bottom-full left-1/2 mb-1 -translate-x-1/2'
              : '',
            position === 'bottom'
              ? 'left-1/2 top-full mt-1 -translate-x-1/2'
              : '',
            position === 'left'
              ? 'right-full top-1/2 mr-1 -translate-y-1/2'
              : '',
            position === 'right'
              ? 'left-full top-1/2 ml-1 -translate-y-1/2'
              : ''
          )}
        ></span>
      </div>
    </div>
  );
};

export default Tooltip;
