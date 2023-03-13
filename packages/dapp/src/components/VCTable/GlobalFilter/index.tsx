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
      className={`flex w-fit flex-1 items-center rounded-full border border-gray-200 shadow-md dark:bg-gray-800 sm:flex-none ${
        !isConnected || vcs.length === 0 ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <MagnifyingGlassIcon
        className={`ml-3 hidden h-5 w-5 text-orange-500 md:block ${
          !isConnected || vcs.length === 0 ? 'bg-gray-50 text-gray-300' : ''
        }`}
        aria-hidden="true"
      />
      <input
        value={globalFilter ?? ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
        className={`font-lg h-full w-full rounded-full pl-3 pr-2 text-orange-500  placeholder:text-orange-200 focus:outline-none dark:bg-gray-800 sm:px-2 ${
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
