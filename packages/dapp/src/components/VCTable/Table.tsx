/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { HTMLProps } from 'react';
import Button from 'src/components/Button';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  FilterFn,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { useSnapStore, useGeneralStore } from '../../utils/store';
import { VC_DATA } from './data';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';

export const Table = () => {
  const vcs = useSnapStore((state) => state.vcs);
  const changeVcs = useSnapStore((state) => state.changeVcs);
  const api = useSnapStore((state) => state.snapApi);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  // const data = React.useMemo(() => vcs, []);

  const columnHelper = createColumnHelper<QueryVCsRequestResult>();

  const columns = [
    columnHelper.accessor((row) => Date.parse(row.data.issuanceDate), {
      id: 'id',
      cell: (info) => <span>{new Date(info.getValue()).toDateString()}</span>,
      header: () => <span>Issuance Date</span>,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor(
      (row) => {
        if (row.data.type) {
          if (typeof row.data.type === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return row.data.type;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (Array.isArray(row.data.type) && row.data.type.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return row.data.type[row.data.type.length - 1] as string;
          }
          return '';
        }
        return '';
      },
      {
        id: 'type',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cell: (info) => <span>{info.getValue().toString()}</span>,
        header: () => <span>Type</span>,
      }
    ),
    columnHelper.accessor(
      (row) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        row.data.credentialSubject.id ? row.data.credentialSubject.id : '',
      {
        id: 'holder',
        cell: (info) => (
          <span>{`${info.getValue().slice(0, 8)}....${info
            .getValue()
            .slice(-4)}`}</span>
        ),
        header: () => <span>Holder</span>,
      }
    ),
    columnHelper.accessor(
      (row) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (typeof row.data.issuer === 'string') return row.data.issuer;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return row.data.issuer.id;
      },
      {
        id: 'issuer',
        cell: (info) => (
          <span>{`${info.getValue().slice(0, 8)}....${info
            .getValue()
            .slice(-4)}`}</span>
        ),
        header: () => <span>Issuer</span>,
      }
    ),
    columnHelper.accessor(
      (row) => Object.keys(row.data.credentialSubject).length.toString(),
      {
        id: 'attributes',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Attributes</span>,
      }
    ),
    columnHelper.accessor(
      (row) => {
        if (row.data.expirationDate)
          return (Date.now() < Date.parse(row.data.expirationDate)).toString();
        return 'true';
      },
      {
        id: 'status',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Status</span>,
      }
    ),
    columnHelper.accessor(
      (row) => {
        if (row.metadata.store) return row.metadata.store.toString();
        return '';
      },
      {
        id: 'data_store',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Data Store</span>,
        enableGlobalFilter: false,
      }
    ),
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: 'action',
      cell: () => <span>btn1 btn2 btn3</span>,
      header: () => <span>Actions</span>,
      enableGlobalFilter: false,
    }),
  ];

  const includesDataStore: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const item = row.getValue('data_store');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const itemArr = (item as string).split(',');
    const valueArr = (value as string).split(',');

    const sortedItemArr = itemArr.sort(function (a, b) {
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    });
    const sortedValueArr = valueArr.sort(function (a, b) {
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    });
    return JSON.stringify(sortedItemArr) === JSON.stringify(sortedValueArr);
  };

  const table = useReactTable({
    data: VC_DATA,
    columns,
    filterFns: { includesDataStore },
    globalFilterFn: 'includesString',
    state: { sorting, globalFilter, columnFilters },
    initialState: { pagination: { pageSize: 5 } },
    enableGlobalFilter: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const loadVCs = async () => {
    const loadedVCs = await api?.queryVCs();
    console.log(loadedVCs);
    if (loadedVCs) {
      changeVcs(loadedVCs);
    }
  };

  const handleLoadVcs = async () => {
    await loadVCs();
  };

  if (vcs.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-full ">
        Load VCs to get Started!
        <Button variant="primary" onClick={handleLoadVcs}>
          Load VCs
        </Button>
      </div>
    );

  return (
    <>
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            // table.setGlobalFilter(e.target.value);
          }}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => {
            setColumnFilters([{ id: 'data_store', value: e.target.value }]);
          }}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search datastore..."
        />
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: ' A',
                    desc: ' D',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
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
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </>
  );
};
