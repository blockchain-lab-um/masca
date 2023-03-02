import React from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Table } from '@tanstack/react-table';

interface TablePaginationProps {
  table: Table<QueryVCsRequestResult>;
}

const TablePagination = ({ table }: TablePaginationProps) => {
  return (
    <div className="mb-auto flex items-center gap-2 font-cabin font-normal text-gray-800">
      <button
        className="rounded-full px-2 py-1 hover:cursor-pointer hover:bg-orange-100 animated-transition"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="rounded-full px-3 py-1 hover:cursor-pointer hover:bg-orange-100 animated-transition"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <span className="font-semibold text-gray-900">
          {table.getState().pagination.pageIndex + 1}{' '}
        </span>
        of{' '}
        <span className="font-semibold text-gray-900">
          {' '}
          {table.getPageCount()}
        </span>
      </span>
      <button
        className="rounded-full px-3 py-1 hover:cursor-pointer hover:bg-orange-100 animated-transition"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="rounded-full px-2 py-1 hover:cursor-pointer hover:bg-orange-100 animated-transition"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
    </div>
  );
};

export default TablePagination;
