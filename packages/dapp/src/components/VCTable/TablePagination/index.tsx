import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface TablePaginationProps {
  table: Table<QueryVCsRequestResult>;
}

const TablePagination = ({ table }: TablePaginationProps) => {
  const t = useTranslations('Dashboard');
  return (
    <div className="font-cabin dark:text-navy-blue-400 mb-auto flex items-center gap-2 font-normal text-gray-500">
      <button
        className="animated-transition rounded-full px-2 py-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="animated-transition rounded-full px-3 py-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <span className="flex items-center gap-1">
        <div>{t('pagination.page')}</div>
        <span className="dark:text-navy-blue-100 font-semibold text-gray-700 ">
          {table.getState().pagination.pageIndex + 1}{' '}
        </span>
        {t('pagination.of')}{' '}
        <span className="dark:text-navy-blue-100 font-semibold text-gray-700 ">
          {' '}
          {table.getPageCount()}
        </span>
      </span>
      <button
        className="animated-transition rounded-full px-3 py-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="animated-transition rounded-full px-2 py-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
    </div>
  );
};

export default TablePagination;
