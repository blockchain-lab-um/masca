import React from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { useTableStore } from '@/utils/stores';

type GlobalFilterProps = {
  isConnected: boolean;
  vcs: QueryVCsRequestResult[];
};

const GlobalFilter = ({ isConnected, vcs }: GlobalFilterProps) => {
  const { globalFilter, setGlobalFilter } = useTableStore(
    (state) => ({
      globalFilter: state.globalFilter,
      setGlobalFilter: state.setGlobalFilter,
    }),
    shallow
  );
  return (
    <div
      className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex flex-1 items-center rounded-full shadow-md sm:flex-none ${
        !isConnected || vcs.length === 0 ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <MagnifyingGlassIcon
        className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 ml-3 hidden h-7 w-7 text-gray-700 md:block ${
          !isConnected || vcs.length === 0 ? 'bg-gray-50 text-gray-300' : ''
        }`}
        aria-hidden="true"
      />
      <input
        value={globalFilter ?? ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
        className={`font-lg dark:bg-navy-blue-700 dark:text-navy-blue-50 dark:placeholder:text-navy-blue-500 h-full w-full rounded-full pl-3 pr-2 text-gray-700 placeholder:text-gray-400 focus:outline-none sm:px-2 ${
          !isConnected || vcs.length === 0
            ? 'bg-gray-50 text-gray-300 placeholder:text-gray-300'
            : 'bg-white'
        }`}
        placeholder="Search all columns..."
        disabled={!isConnected || vcs.length === 0}
      />
    </div>
  );
};

export default GlobalFilter;
