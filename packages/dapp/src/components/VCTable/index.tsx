'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  isError,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import {
  PlusCircleIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { VerifiableCredential } from '@veramo/core';
import { encodeBase64url } from '@veramo/utils';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import DeleteModal from '@/components/DeleteModal';
import InfoIcon from '@/components/InfoIcon';
import {
  removeCredentialSubjectFilterString,
  stringifyCredentialSubject,
} from '@/utils/format';
import { convertTypes } from '@/utils/string';
import { useMascaStore, useTableStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { ShareCredentialModal } from '../ShareCredentialModal';
import StoreIcon from '../StoreIcon';
import { LastFetched } from './LastFetched';
import TablePagination from './TablePagination';
import {
  includesDataStore,
  includesEcosystem,
  includesType,
  recursiveIncludes,
  selectRows,
} from './tableUtils';
import VCCard from './VCCard';

const Table = () => {
  const t = useTranslations('Dashboard');
  const router = useRouter();

  // Local state
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedVC, setSelectedVC] = useState<QueryCredentialsRequestResult>();
  const [shareCredential, setShareCredential] =
    useState<VerifiableCredential>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Global state
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  const { api, vcs, changeVcs, changeLastFetch } = useMascaStore((state) => ({
    api: state.mascaApi,
    vcs: state.vcs,
    changeVcs: state.changeVcs,
    changeLastFetch: state.changeLastFetch,
  }));

  const { columnFilters, globalFilter, selectedVCs, cardView, setSelectedVCs } =
    useTableStore((state) => ({
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      selectedVCs: state.selectedVCs,
      cardView: state.cardView,
      setSelectedVCs: state.setSelectedVCs,
    }));

  const columnHelper = createColumnHelper<QueryCredentialsRequestResult>();

  const columns = [
    columnHelper.accessor(
      (row) => {
        const types = convertTypes(row.data.type);
        return types.split(',')[0];
      },
      {
        id: 'type',
        cell: (info) => (
          <span className="font-bold">{info.getValue().toString()}</span>
        ),
        header: () => <span className="">{t('table.type')}</span>,
        filterFn: includesType,
      }
    ),
    columnHelper.accessor((row) => Date.parse(row.data.issuanceDate), {
      id: 'date',
      cell: (info) => (
        <span className="flex items-center justify-center">
          {new Date(info.getValue()).toDateString()}
        </span>
      ),
      header: () => <span>{t('table.issuance-date')}</span>,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor(
      (row) =>
        row.data.credentialSubject.id ? row.data.credentialSubject.id : '',
      {
        id: 'subject',
        cell: (info) => {
          if (!info.getValue()) return '/';
          return (
            <Tooltip
              content={t('tooltip.open-did')}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <a
                href={`https://dev.uniresolver.io/#${info.getValue()}`}
                target="_blank"
                rel="noreferrer"
                className="dark:text-orange-accent-dark dark:hover:text-orange-accent-dark/80 flex items-center justify-center text-pink-400 underline hover:text-pink-500"
              >{`${info.getValue().slice(0, 8)}....${info
                .getValue()
                .slice(-4)}`}</a>
            </Tooltip>
          );
        },
        header: () => <span>{t('table.subject')}</span>,
      }
    ),
    columnHelper.accessor(
      (row) => {
        if (!row.data.issuer) return '';
        if (typeof row.data.issuer === 'string') return row.data.issuer;
        return row.data.issuer.id ? row.data.issuer.id : '';
      },
      {
        id: 'issuer',
        cell: (info) => (
          <Tooltip
            content={t('tooltip.open-did')}
            className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
          >
            <a
              href={`https://dev.uniresolver.io/#${info.getValue()}`}
              target="_blank"
              rel="noreferrer"
              className="dark:text-orange-accent-dark dark:hover:text-orange-accent-dark/80 flex items-center justify-center text-pink-400 underline hover:text-pink-500"
            >{`${info.getValue().slice(0, 8)}....${info
              .getValue()
              .slice(-4)}`}</a>
          </Tooltip>
        ),
        header: () => <span>{t('table.issuer')}</span>,
        filterFn: includesEcosystem,
      }
    ),
    columnHelper.accessor((row) => row.data.expirationDate, {
      id: 'exp_date',
      cell: (info) => (
        <span className="flex items-center justify-center">
          {info.getValue() === undefined
            ? '/'
            : new Date(info.getValue()!).toDateString()}
        </span>
      ),
      header: () => <span>{t('table.expiration-date')}</span>,
      enableGlobalFilter: false,
    }),
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
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
              content={`${
                info.cell.row.original.data.expirationDate === undefined
                  ? t('tooltip.no-exp-date')
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
            {t('table.status')} <InfoIcon content={t('tooltip.status')} />
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => (row.metadata.store ? row.metadata.store.toString() : ''),
      {
        id: 'data_store',
        cell: (info) => (
          <div className="flex items-center justify-center gap-x-1">
            {info
              .getValue()
              .split(',')
              .map((store, id) => (
                <Tooltip
                  className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                  content={store}
                  key={id}
                >
                  <div className="relative mt-1">
                    <StoreIcon store={store} key={id} />
                  </div>
                </Tooltip>
              ))}
          </div>
        ),
        header: () => (
          <span className="flex gap-x-1">
            {t('table.store')} <InfoIcon content={t('tooltip.store')} />
          </span>
        ),
        enableGlobalFilter: false,
        filterFn: includesDataStore,
      }
    ),
    columnHelper.accessor(
      (row) =>
        row.data.credentialSubject?.filterString
          ? (row.data.credentialSubject.filterString as string)
          : '',
      {
        id: 'credential_subject',
      }
    ),
    columnHelper.display({
      id: 'select',
      header: () => <>{t('table.select')}</>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-1">
          <button onClick={row.getToggleSelectedHandler()}>
            {row.getIsSelected() ? (
              <MinusCircleIcon className="dark:text-orange-accent-dark h-7 w-7 text-pink-500" />
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
        <div className="flex items-center justify-center space-x-2">
          <Tooltip
            className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            content={
              isSignedIn ? t('tooltip.share') : t('tooltip.sign-in-to-share')
            }
          >
            <button
              disabled={!isSignedIn}
              className="disabled:opacity-50"
              onClick={() => {
                setShareCredential(
                  removeCredentialSubjectFilterString(row.original).data
                );
                setShareModalOpen(true);
              }}
            >
              <ShareIcon className="h-6 w-6" />
            </button>
          </Tooltip>
          <Tooltip
            className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            content={t('tooltip.delete')}
          >
            <button
              onClick={() => {
                setDeleteModalOpen(true);
                setSelectedVC(row.original);
              }}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </Tooltip>
        </div>
      ),
      header: () => <span>{t('table.actions')}</span>,
      enableGlobalFilter: false,
    }),
  ];

  const table = useReactTable({
    data: vcs,
    columns,
    filterFns: {
      includesDataStore,
      recursiveIncludes,
      includesType,
      includesEcosystem,
    },
    globalFilterFn: recursiveIncludes,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility: { credential_subject: false },
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

  // Functions
  const loadVCs = async () => {
    if (!api) return;
    const loadedVCs = await api.queryCredentials();

    if (isError(loadedVCs)) {
      console.log(loadedVCs.error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('query-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    changeLastFetch(Date.now());

    if (loadedVCs.data) {
      changeVcs(loadedVCs.data.map((vc) => stringifyCredentialSubject(vc)));
      if (loadedVCs.data.length === 0) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('query-no-credentials'),
            type: 'info',
            loading: false,
            link: null,
          });
        }, 200);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('query-success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  const handleLoadVcs = async () => {
    setLoading(true);
    await loadVCs();
    setLoading(false);
  };

  // Use effects
  useEffect(() => {
    selectRows(table, selectedVCs);
  }, []);

  if (vcs.length === 0)
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleLoadVcs}
          loading={loading}
        >
          {t('no-credentials.load')}
        </Button>
        <span className="py-4 text-lg font-semibold">
          {t('no-credentials.or')}
        </span>
        <Link href="/app/create-credential">
          <Button variant="secondary" size="sm" onClick={() => {}}>
            {t('no-credentials.get')}
          </Button>
        </Link>
      </div>
    );

  if (!cardView) {
    return (
      <>
        <div className="relative flex h-full min-h-[50vh] w-full flex-col">
          <div className="dark:border-navy-blue-600 flex items-center justify-between border-b border-gray-400 p-5">
            <div className="text-h2 font-ubuntu dark:text-navy-blue-50 pl-4 font-medium text-gray-800">
              {t('table-header.credentials')}
            </div>
            <div className="text-right">
              <div className="text-h4 dark:text-navy-blue-50 text-gray-800">
                {vcs.length} {t('table-header.found')}
              </div>
              <LastFetched />
            </div>
          </div>
          <table className="dark:text-navy-blue-400 min-w-full text-center text-lg text-gray-700">
            <thead className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className={`font-cabin px-3 py-4 text-sm font-normal ${
                        header.id === 'date' || header.id === 'exp_date'
                          ? 'hidden lg:table-cell'
                          : ''
                      }
                      ${header.id === 'subject' ? 'hidden xl:table-cell' : ''}
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
                            <ChevronDownIcon className="dark:text-navy-blue-400 h-4 w-4 text-gray-600" />
                          ),
                          desc: (
                            <ChevronUpIcon className="dark:text-navy-blue-400 h-4 w-4 text-gray-600" />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="dark:text-navy-blue-50 break-before-auto border-b text-gray-800">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`dark:border-navy-blue-tone/30 animated-transition dark:border-navy-blue-700 border-b border-gray-100 duration-75 hover:cursor-pointer ${
                    row.getIsSelected()
                      ? 'dark:bg-navy-blue-700 bg-pink-50/60 hover:bg-pink-50'
                      : 'dark:hover:bg-navy-blue-700/30 hover:bg-gray-50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      onClick={() => {
                        if (
                          cell.column.id !== 'select' &&
                          cell.column.id !== 'expand' &&
                          cell.column.id !== 'subject' &&
                          cell.column.id !== 'status' &&
                          cell.column.id !== 'data_store' &&
                          cell.column.id !== 'issuer' &&
                          cell.column.id !== 'actions'
                        ) {
                          router.push(
                            `/app/verifiable-credential/${encodeBase64url(
                              row.original.metadata.id
                            )}`
                          );
                        }
                      }}
                      className={clsx(
                        'max-h-16 py-5',
                        cell.column.id === 'exp_date' ||
                          cell.column.id === 'date'
                          ? 'hidden lg:table-cell'
                          : '',
                        cell.column.id === 'type'
                          ? 'w-[20%] max-w-[20%] px-2'
                          : '',
                        cell.column.id === 'actions'
                          ? 'hidden sm:table-cell'
                          : '',
                        cell.column.id === 'subject'
                          ? 'hidden xl:table-cell'
                          : ''
                      )}
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
          <div className="mt-auto flex justify-center rounded-b-3xl pb-3 pt-3">
            <TablePagination table={table} />
          </div>
          {table.getSelectedRowModel().rows.length > 0 && (
            <div className="absolute -bottom-3 right-10 md:-bottom-4 lg:-bottom-5">
              <Link href="/app/create-verifiable-presentation">
                <Button
                  variant="primary"
                  size="wd"
                  onClick={() => {
                    setSelectedVCs(
                      table.getSelectedRowModel().rows.map((r) => r.original)
                    );
                  }}
                >
                  {t('create-verifiable-presentation')}{' '}
                  {table.getSelectedRowModel().rows.length > 0 &&
                    `(${table.getSelectedRowModel().rows.length})`}
                </Button>
              </Link>
            </div>
          )}
        </div>
        <DeleteModal
          isOpen={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          vc={selectedVC}
        />
        <ShareCredentialModal
          isOpen={shareModalOpen}
          setOpen={setShareModalOpen}
          credentials={shareCredential ? [shareCredential] : []}
        />
      </>
    );
  }

  return (
    <div className="relative flex h-full min-h-[50vh] w-full flex-col">
      <div className="dark:border-navy-blue-600 flex items-center justify-between border-b border-gray-400 p-5">
        <div className="text-h2 font-ubuntu dark:text-navy-blue-50 pl-4 font-medium text-gray-800">
          {t('table-header.credentials')}
        </div>
        <div className="text-right">
          <div className="text-h4 dark:text-navy-blue-50 text-gray-800">
            {vcs.length} {t('table-header.found')}
          </div>
          <LastFetched />
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {table.getRowModel().rows.map((row, key) => (
          <VCCard key={key} row={row} />
        ))}
      </div>
      <div className="mt-auto flex justify-center rounded-b-3xl pb-3 pt-3">
        <TablePagination table={table} />
      </div>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="absolute -bottom-3 right-10 md:-bottom-4 lg:-bottom-5">
          <Link href="/app/create-verifiable-presentation">
            <Button
              variant="primary"
              size="wd"
              onClick={() => {
                setSelectedVCs(
                  table.getSelectedRowModel().rows.map((r) => r.original)
                );
              }}
            >
              {t('create-verifiable-presentation')}{' '}
              {table.getSelectedRowModel().rows.length > 0 &&
                `(${table.getSelectedRowModel().rows.length})`}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Table;
