import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useTableStore } from '../../../utils/store';

export const GlobalFilter = () => {
  const setGlobalFilter = useTableStore((state) => state.setGlobalFilter);
  const globalFilter = useTableStore((state) => state.globalFilter);
  return (
    <div className="flex items-center flex-1 sm:flex-none bg-white w-fit rounded-full dark:bg-gray-800">
      <MagnifyingGlassIcon
        className="hidden h-6 w-6 md:block text-orange-500 ml-3"
        aria-hidden="true"
      />
      <input
        value={globalFilter ?? ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
          // table.setGlobalFilter(e.target.value);
        }}
        className="font-lg pl-3 pr-2 sm:px-2 w-full h-full rounded-full bg-white text-orange-500 placeholder:text-orange-200 focus:outline-none dark:bg-gray-800"
        placeholder="Search all columns..."
      />
    </div>
  );
};
