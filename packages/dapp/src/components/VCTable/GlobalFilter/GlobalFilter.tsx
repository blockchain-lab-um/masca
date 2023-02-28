import React from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useTableStore } from '../../../utils/store';

type GlobalFilterProps = {
  isConnected: boolean;
  vcs: QueryVCsRequestResult[];
};

export const GlobalFilter = ({ isConnected, vcs }: GlobalFilterProps) => {
  const setGlobalFilter = useTableStore((state) => state.setGlobalFilter);
  const globalFilter = useTableStore((state) => state.globalFilter);
  return (
    <div
      className={`flex items-center flex-1 sm:flex-none bg-white w-fit rounded-full dark:bg-gray-800 border border-gray-200 shadow-md ${
        !isConnected || vcs.length === 0 ? 'bg-gray-50' : ''
      }`}
    >
      <MagnifyingGlassIcon
        className={`hidden h-5 w-5 md:block text-orange-500 ml-3 ${
          !isConnected || vcs.length === 0 ? 'text-gray-300 bg-gray-50' : ''
        }`}
        aria-hidden="true"
      />
      <input
        value={globalFilter ?? ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
          // table.setGlobalFilter(e.target.value);
        }}
        className={`font-lg pl-3 pr-2 sm:px-2 w-full h-full rounded-full bg-white text-orange-500 placeholder:text-orange-200 focus:outline-none dark:bg-gray-800 ${
          !isConnected || vcs.length === 0
            ? 'text-gray-300 placeholder:text-gray-300 bg-gray-50'
            : ''
        }`}
        placeholder="Search all columns..."
        disabled={!isConnected || vcs.length === 0}
      />
    </div>
  );
};
