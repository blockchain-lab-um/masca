import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { isError } from '@blockchain-lab-um/utils';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowsPointingOutIcon,
  PlusCircleIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import DeleteModal from '@/components/DeleteModal';
import InfoIcon from '@/components/InfoIcon';
import StoreIcon from '@/components/StoreIcon';
import Tooltip from '@/components/Tooltip';
import { useSnapStore, useTableStore } from '@/utils/stores';
import { convertTypes } from '@/utils/string';
import TablePagination from './TablePagination';
import VCCard from './VCCard';
import { includesDataStore, selectRows } from './tableUtils';

const Table = () => {
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { vcs, changeVcs, api } = useSnapStore(
    (state) => ({
      vcs: state.vcs,
      changeVcs: state.changeVcs,
      api: state.snapApi,
    }),
    shallow
  );
  const { columnFilters, globalFilter, selectedVCs, cardView, setSelectedVCs } =
    useTableStore(
      (state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        selectedVCs: state.selectedVCs,
        cardView: state.cardView,
        setSelectedVCs: state.setSelectedVCs,
      }),
      shallow
    );
  const columnHelper = createColumnHelper<QueryVCsRequestResult>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVC, setSelectedVC] = useState<QueryVCsRequestResult>();

  const columns = [
    columnHelper.display({
      id: 'expand',
      header: ({ table }) => <></>,
      cell: ({ row, table }) => (
        <Link
          href={{
            pathname: '/vc',
            query: { id: row.original.metadata.id },
          }}
        >
          <button
            onClick={() =>
              setSelectedVCs(
                table.getSelectedRowModel().rows.map((r) => r.original)
              )
            }
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </button>
        </Link>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.accessor(
      (row) => {
        const types = convertTypes(row.data.type);
        return types.split(',')[0];
      },
      {
        id: 'type',
        cell: (info) => <span className="">{info.getValue().toString()}</span>,
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
        row.data.credentialSubject.id ? row.data.credentialSubject.id : '',
      {
        id: 'subject',
        cell: (info) => (
          <Tooltip tooltip={'Open DID in Universal resolver'}>
            <a
              href={`https://dev.uniresolver.io/#${info.getValue()}`}
              target="_blank"
              rel="noreferrer"
              className="text-pink-400 underline hover:text-pink-500"
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
        if (!row.data.issuer) return '';
        if (typeof row.data.issuer === 'string') return row.data.issuer;
        if (row.data.issuer.id) return row.data.issuer.id;
        return '';
      },
      {
        id: 'issuer',
        cell: (info) => (
          <Tooltip tooltip={'Open DID in Universal resolver'}>
            <a
              href={`https://dev.uniresolver.io/#${info.getValue()}`}
              target="_blank"
              rel="noreferrer"
              className="text-pink-400 underline hover:text-pink-500"
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
          <span className="flex items-center justify-center">
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
                <XCircleIcon className="h-6 w-6 text-red-500" />
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
          <div className="flex items-center justify-center">
            {info
              .getValue()
              .split(',')
              .map((store, id) => (
                <Tooltip tooltip={store} key={id}>
                  <div className="mt-1">
                    <StoreIcon store={store} key={id} />
                  </div>
                </Tooltip>
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
        <div className="flex items-center justify-center px-1">
          <button onClick={row.getToggleSelectedHandler()}>
            {row.getIsSelected() ? (
              <MinusCircleIcon className="h-7 w-7 text-pink-500 dark:text-white" />
            ) : (
              <PlusCircleIcon className="h-7 w-7" />
            )}
          </button>
        </div>
      ),
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <button>
            <ShareIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              setDeleteModalOpen(true);
              setSelectedVC(row.original);
            }}
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      ),
      header: () => <span>ACTIONS</span>,
      enableGlobalFilter: false,
    }),
  ];

  const table = useReactTable({
    data: vcs,
    columns,
    filterFns: { includesDataStore },
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 9 } },
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
    if (!api) return;
    const loadedVCs = await api.queryVCs();
    if (isError(loadedVCs)) {
      console.log('Failed to load VCs');
      return;
    }
    if (loadedVCs.data) {
      changeVcs(loadedVCs.data);
    }
  };

  const handleLoadVcs = async () => {
    setLoading(true);
    await loadVCs();
    setLoading(false);
  };

  useEffect(() => {
    selectRows(table, selectedVCs);
  }, []);

  if (vcs.length === 0)
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={handleLoadVcs}
          loading={loading}
        >
          Load VCs
        </Button>
        <span className="py-4 text-lg font-semibold">or</span>
        <Link
          href="https://blockchain-lab-um.github.io/course-dapp"
          target="_blank"
        >
          <Button variant="secondary" size="sm" onClick={() => {}}>
            Get your first VC
          </Button>
        </Link>
      </div>
    );

  if (!cardView) {
    return (
      <>
        <div className="relative flex h-full min-h-[50vh] w-full flex-col">
          <table className="lg:text-md min-w-full text-center text-sm text-gray-800 dark:text-white">
            <thead className="border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className={`font-ubuntu text-md px-3 py-4 font-bold ${
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
                      <div className="flex items-center justify-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: (
                            <ChevronDownIcon className="h-4 w-4 text-gray-800 dark:text-white" />
                          ),
                          desc: (
                            <ChevronUpIcon className="h-4 w-4 text-gray-800 dark:text-white" />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="break-all  border-b text-gray-800 dark:text-white/60">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`dark:border-navy-blue-tone/30 animated-transition border-b-2  border-gray-500/30 duration-75 ${
                    row.getIsSelected()
                      ? 'dark:bg-navy-blue-400/80 bg-pink-50 hover:bg-pink-50'
                      : 'dark:hover:bg-navy-blue-400/30 hover:bg-gray-50'
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
                        ) {
                          row.toggleSelected();
                          setSelectedVCs(
                            table
                              .getSelectedRowModel()
                              .rows.map((r) => r.original)
                          );
                        }
                      }}
                      className={`max-h-16 py-5  ${
                        cell.column.id === 'type' ||
                        cell.column.id === 'exp_date'
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dark:bg-navy-blue-600 mt-auto flex justify-center rounded-b-3xl bg-gray-50 pt-3 pb-3">
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
        <DeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          vc={selectedVC}
        />
      </>
    );
  }
  return (
    <>
      <div className="relative flex h-full min-h-[50vh] w-full flex-col">
        <div className="flex flex-wrap justify-center">
          {table.getRowModel().rows.map((row, key) => (
            <VCCard key={key} row={row} />
          ))}
        </div>
        <div className="dark:bg-navy-blue-600 mt-auto flex justify-center rounded-b-3xl bg-gray-50 pt-3 pb-3">
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
    </>
  );
};

export default Table;
