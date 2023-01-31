import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Table } from '@tanstack/react-table';
import React from 'react';

interface TablePaginationProps {
  table: Table<QueryVCsRequestResult>;
}

export const TablePagination = ({ table }: TablePaginationProps) => {
  return (
    <div className="mb-auto flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
    </div>
  );
};
