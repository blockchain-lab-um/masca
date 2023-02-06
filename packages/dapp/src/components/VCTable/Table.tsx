/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { HTMLProps, useEffect } from 'react';
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
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import StoreIcon from '../StoreIcon';
import { useSnapStore, useTableStore } from '../../utils/store';
import { VC_DATA } from './data';
import TablePagination from './TablePagination';
import InfoIcon from '../InfoIcon';
import Tooltip from '../Tooltip';

export const Table = () => {
  const vcs = useSnapStore((state) => state.vcs);
  const changeVcs = useSnapStore((state) => state.changeVcs);
  const api = useSnapStore((state) => state.snapApi);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnFilters = useTableStore((state) => state.columnFilters);
  const globalFilter = useTableStore((state) => state.globalFilter);
  const selectedVCs = useTableStore((state) => state.selectedVCs);
  const setSelectedVCs = useTableStore((state) => state.setSelectedVCs);
  const columnHelper = createColumnHelper<QueryVCsRequestResult>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    selectRows();
  }, []);

  const includesDataStore: FilterFn<any> = (row, columnId, value, addMeta) => {
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
    columnHelper.display({
      id: 'expand',
      header: ({ table }) => <></>,
      cell: ({ row }) => (
        // <Link href={`/vc/${row.original.metadata.id}`}>
        <Link
          href={{
            pathname: '/vc',
            query: { id: row.original.metadata.id },
          }}
        >
          <button>
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
        </Link>
      ),
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
            return row.data.type[row.data.type.length - 1];
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
    columnHelper.accessor((row) => Date.parse(row.data.issuanceDate), {
      id: 'date',
      cell: (info) => <span>{new Date(info.getValue()).toDateString()}</span>,
      header: () => <span>ISSUANCE DATE</span>,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor(
      (row) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        row.data.credentialSubject.id ? row.data.credentialSubject.id : '',
      {
        id: 'subject',
        cell: (info) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <Tooltip tooltip={'Open DID in Universal resolver'}>
            <a
              href={`https://dev.uniresolver.io/#${info.getValue()}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-500 hover:text-orange-700 underline"
            >{`${info.getValue().slice(0, 8)}....${info
              .getValue()
              .slice(-4)}`}</a>
          </Tooltip>
        ),
        header: () => <span>SUBJECT</span>,
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <Tooltip tooltip={'Open DID in Universal resolver'}>
            <a
              href={`https://dev.uniresolver.io/#${info.getValue()}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-500 hover:text-orange-700 underline"
            >{`${info.getValue().slice(0, 8)}....${info
              .getValue()
              .slice(-4)}`}</a>
          </Tooltip>
        ),
        header: () => <span>ISSUER</span>,
      }
    ),
    columnHelper.accessor(
      (row) => {
        return row.data.expirationDate;
      },
      {
        id: 'exp_date',
        cell: (info) => (
          <span>
            {info.getValue() === undefined
              ? '/'
              : new Date(info.getValue() as string).toDateString()}
          </span>
        ),
        header: () => <span>EXPIRATION DATE</span>,
        enableGlobalFilter: false,
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
            <Tooltip
              tooltip={`${
                info.cell.row.original.data.expirationDate === undefined
                  ? 'Does not have expiration date'
                  : `${
                      info.getValue() === 'true' ? 'Expires' : 'Expired'
                    } on ${new Date(
                      info.cell.row.original.data.expirationDate
                    ).toDateString()}`
              }`}
            >
              {info.getValue() === 'true' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <MinusCircleIcon className="h-6 w-6 text-red-500" />
              )}
            </Tooltip>
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
        cell: (info) => (
          <div className="flex justify-center items-center">
            {info
              .getValue()
              .split(',')
              .map((store, id) => (
                <StoreIcon store={store} key={id} />
              ))}
          </div>
        ),
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
              <MinusCircleIcon className="w-7 h-7 text-orange-500" />
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
    initialState: {},
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

  const selectRows = () => {
    table.getPrePaginationRowModel().rows.forEach((row) => {
      if (
        selectedVCs.filter((vc) => vc.metadata.id === row.original.metadata.id)
          .length > 0
      ) {
        row.toggleSelected(true);
      }
    });
  };

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
      <div className="flex flex-col justify-center items-center min-h-[50vh] ">
        Load VCs to get Started!
        <Button variant="primary" size="lg" onClick={handleLoadVcs}>
          Load VCs
        </Button>
      </div>
    );

  return (
    <div className="relative h-full min-h-[50vh] w-full flex flex-col">
      <table className="min-w-full text-center text-gray-800 text-sm lg:text-md">
        <thead className="border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={`px-3 py-4 font-semibold text-md ${
                    header.id === 'type' || header.id === 'exp_date'
                      ? 'hidden lg:table-cell'
                      : ''
                  }
                  ${
                    header.id === 'date' || header.id === 'subject'
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
                        <ChevronDownIcon className="h-4 w-4 text-gray-800" />
                      ),
                      desc: <ChevronUpIcon className="h-4 w-4 text-gray-800" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="border-b text-gray-800 break-all">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-gray-500  animated-transition duration-75 ${
                row.getIsSelected()
                  ? 'bg-orange-50 hover:bg-orange-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  onClick={() => {
                    if (
                      cell.column.id !== 'select' &&
                      cell.column.id !== 'expand' &&
                      cell.column.id !== 'subject' &&
                      cell.column.id !== 'issuer' &&
                      cell.column.id !== 'actions'
                    )
                      row.toggleSelected();
                  }}
                  className={`py-5 max-h-16  ${
                    cell.column.id === 'type' || cell.column.id === 'exp_date'
                      ? 'hidden lg:table-cell'
                      : ''
                  }
                  ${
                    cell.column.id === 'date' || cell.column.id === 'subject'
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
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="absolute -bottom-5 right-10">
          <Link href="createVP">
            <Button
              variant="primary"
              size="wd"
              onClick={() => {
                setSelectedVCs(
                  table.getSelectedRowModel().rows.map((r) => r.original)
                );
              }}
            >
              Create Presentation{' '}
              {table.getSelectedRowModel().rows.length > 0 &&
                `(${table.getSelectedRowModel().rows.length})`}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
