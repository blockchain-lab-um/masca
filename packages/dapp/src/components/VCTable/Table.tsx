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
} from '@tanstack/react-table';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import {
  MinusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

import {
  PlusCircleIcon,
  MinusCircleIcon as MinusCircleOutline,
  TrashIcon,
  ShareIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { useSnapStore, useTableStore } from '../../utils/store';
import { VC_DATA } from './data';
import TablePagination from './TablePagination';
import InfoIcon from '../InfoIcon';

export const Table = () => {
  const vcs = useSnapStore((state) => state.vcs);
  const changeVcs = useSnapStore((state) => state.changeVcs);
  const api = useSnapStore((state) => state.snapApi);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnFilters = useTableStore((state) => state.columnFilters);
  const globalFilter = useTableStore((state) => state.globalFilter);
  // const data = React.useMemo(() => vcs, []);

  const columnHelper = createColumnHelper<QueryVCsRequestResult>();

  const includesDataStore: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const item = row.getValue('data_store');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const itemArr = (item as string).split(',');

    let matching = false;
    for (let i = 0; i < value.length; i += 1) {
      if (itemArr.indexOf(value[i]) >= 0) {
        matching = true;
      }
    }
    return matching;
  };

  const columns = [
    columnHelper.accessor((row) => Date.parse(row.data.issuanceDate), {
      id: 'date',
      cell: (info) => <span>{new Date(info.getValue()).toDateString()}</span>,
      header: () => <span>ISSUANCE DATE</span>,
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
        header: () => <span>TYPE</span>,
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
        header: () => <span>HOLDER</span>,
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
        header: () => <span>ISSUER</span>,
      }
    ),
    columnHelper.accessor(
      (row) => Object.keys(row.data.credentialSubject).length.toString(),
      {
        id: 'attributes',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>No. ATTRIBUTES</span>,
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
        cell: (info) => (
          <span className="flex justify-center items-center">
            {info.getValue() === 'true' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <MinusCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </span>
        ),
        header: () => (
          <span className="flex gap-x-1">
            STATUS <InfoIcon>Validity of the VC</InfoIcon>
          </span>
        ),
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
        header: () => (
          <span className="flex gap-x-1">
            STORE <InfoIcon>Place where VC is stored</InfoIcon>
          </span>
        ),
        enableGlobalFilter: false,
        filterFn: includesDataStore,
      }
    ),
    columnHelper.display({
      id: 'select',
      header: ({ table }) => <>SELECT</>,
      cell: ({ row }) => (
        <div className="px-1 flex justify-center items-center">
          <button onClick={row.getToggleSelectedHandler()}>
            {row.getIsSelected() ? (
              <MinusCircleIcon className="w-7 h-7" />
            ) : (
              <PlusCircleIcon className="w-7 h-7" />
            )}
          </button>
        </div>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex items-center justify-center gap-1">
          <button>
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
          <button>
            <ShareIcon className="w-6 h-6" />
          </button>
          <button>
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      ),
      header: () => <span>ACTIONS</span>,
      enableGlobalFilter: false,
    }),
  ];

  const table = useReactTable({
    data: VC_DATA,
    columns,
    filterFns: { includesDataStore },
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    // initialState: { pagination: { pageSize: 9 } },
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
        <Button variant="primary" size="lg" onClick={handleLoadVcs}>
          Load VCs
        </Button>
      </div>
    );

  return (
    <div className="relative h-full flex flex-col">
      <table className="min-w-full text-center text-gray-800 text-md lg:text-lg">
        <thead className="border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={`px-3 py-4 font-semibold text-md ${
                    header.id === 'type' || header.id === 'attributes'
                      ? 'hidden lg:table-cell'
                      : ''
                  }
                  ${
                    header.id === 'date' || header.id === 'holder'
                      ? 'hidden md:table-cell'
                      : ''
                  }
                  ${header.id === 'actions' ? 'hidden md:table-cell' : ''}
                  `}
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex justify-center items-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: (
                        <ChevronDownIcon className="h-5 w-5 text-gray-800" />
                      ),
                      desc: <ChevronUpIcon className="h-5 w-5 text-gray-800" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="border-b text-gray-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => {
                console.log('Row clicked');
              }}
              className="border-b border-gray-500 hover:bg-gray-100 animated-transition duration-75"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={`py-5 max-h-16 whitespace-nowrap  ${
                    cell.column.id === 'type' || cell.column.id === 'attributes'
                      ? 'hidden lg:table-cell'
                      : ''
                  }
                  ${
                    cell.column.id === 'date' || cell.column.id === 'holder'
                      ? 'hidden md:table-cell'
                      : ''
                  }
                  ${
                    cell.column.id === 'actions' ? 'hidden sm:table-cell' : ''
                  }`}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-auto pt-9 flex justify-center pb-9">
        <TablePagination table={table} />
      </div>
      <div className="absolute -bottom-5 right-10">
        <Button variant="primary" size="wd" onClick={() => {}}>
          Create Presentation{' '}
          {table.getSelectedRowModel().rows.length > 0 &&
            `(${table.getSelectedRowModel().rows.length})`}
        </Button>
      </div>
    </div>
  );
};
