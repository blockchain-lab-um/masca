import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { VerifiableCredential } from '@veramo/core';
import { encodeBase64url } from '@veramo/utils';
import { useTranslations } from 'next-intl';

import DeleteModal from '@/components/DeleteModal';
import { ShareCredentialModal } from '@/components/ShareCredentialModal';
import StoreIcon from '@/components/StoreIcon';
import { convertTypes } from '@/utils/string';
import { useTableStore } from '@/stores';
import { LastFetched } from '../LastFetched';
import { sortCredentialList } from '../utils';

type Key = string | number;
type SelectedKeys = 'all' | Iterable<Key> | undefined;

const ROWS_PER_PAGE = 3;

const columns = [
  {
    key: 'type',
    label: 'TYPE',
    allowSorting: true,
  },
  {
    key: 'date',
    label: 'DATE',
    allowSorting: true,
  },
  {
    key: 'subject',
    label: 'SUBJECT',
    allowSorting: true,
  },
  {
    key: 'issuer',
    label: 'ISSUER',
    allowSorting: true,
  },
  {
    key: 'exp_date',
    label: 'EXPIRATION DATE',
    allowSorting: true,
  },
  {
    key: 'status',
    label: 'STATUS',
  },
  {
    key: 'data_store',
    label: 'DATA STORE',
  },
  {
    key: 'actions',
    label: 'ACTIONS',
  },
];

interface CredentialTableProps {
  vcs: QueryCredentialsRequestResult[];
}

const CredentialTable = ({ vcs }: CredentialTableProps) => {
  const t = useTranslations('Dashboard');
  const [selectedKeys, setSelectedKeys] = useState<SelectedKeys>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedVC, setSelectedVC] = useState<QueryCredentialsRequestResult>();
  const [shareCredential, setShareCredential] =
    useState<VerifiableCredential>();
  const [page, setPage] = useState(1);

  const router = useRouter();

  const { setSelectedVCs } = useTableStore((state) => ({
    setSelectedVCs: state.setSelectedVCs,
  }));

  const renderCell = React.useCallback(
    (vc: QueryCredentialsRequestResult, columnKey: React.Key) => {
      switch (columnKey) {
        case 'type':
          // eslint-disable-next-line no-case-declarations
          const types = convertTypes(vc.data.type);
          return <span className="font-bold">{types.split(',')[0]}</span>;
        case 'date':
          // eslint-disable-next-line no-case-declarations
          const date = Date.parse(vc.data.issuanceDate);
          return (
            <span className="flex items-center justify-center">
              {new Date(date).toDateString()}
            </span>
          );
        case 'subject':
          // eslint-disable-next-line no-case-declarations
          const subject = vc.data.credentialSubject.id
            ? vc.data.credentialSubject.id
            : '';
          return (
            <Tooltip
              content={t('tooltip.open-did')}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <a
                href={`https://dev.uniresolver.io/#${subject}`}
                target="_blank"
                rel="noreferrer"
                className="dark:text-orange-accent-dark dark:hover:text-orange-accent-dark/80 flex items-center justify-center text-pink-400 underline hover:text-pink-500"
              >{`${subject.slice(0, 8)}....${subject.slice(-4)}`}</a>
            </Tooltip>
          );
        case 'issuer':
          // eslint-disable-next-line no-case-declarations
          let issuer;
          if (!vc.data.issuer) issuer = '';
          else if (typeof vc.data.issuer === 'string') issuer = vc.data.issuer;
          else issuer = vc.data.issuer.id ? vc.data.issuer.id : '';
          return (
            <Tooltip
              content={t('tooltip.open-did')}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <a
                href={`https://dev.uniresolver.io/#${issuer}`}
                target="_blank"
                rel="noreferrer"
                className="dark:text-orange-accent-dark dark:hover:text-orange-accent-dark/80 flex items-center justify-center text-pink-400 underline hover:text-pink-500"
              >{`${issuer.slice(0, 8)}....${issuer.slice(-4)}`}</a>
            </Tooltip>
          );
        case 'exp_date':
          return (
            <span className="flex items-center justify-center">
              {vc.data.expirationDate === undefined
                ? '/'
                : new Date(vc.data.expirationDate).toDateString()}
            </span>
          );
        case 'status':
          // eslint-disable-next-line no-case-declarations
          let status = 'true';
          if (vc.data.expirationDate)
            status = (
              Date.now() < Date.parse(vc.data.expirationDate)
            ).toString();
          return (
            <span className="flex items-center justify-center">
              <Tooltip
                className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                content={`${
                  vc.data.expirationDate === undefined
                    ? t('tooltip.no-exp-date')
                    : `${
                        status === 'true' ? 'Expires' : 'Expired'
                      } on ${new Date(vc.data.expirationDate).toDateString()}`
                }`}
              >
                {status === 'true' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-500" />
                )}
              </Tooltip>
            </span>
          );
        case 'data_store':
          // eslint-disable-next-line no-case-declarations
          const dataStore = vc.metadata.store
            ? vc.metadata.store.toString()
            : '';
          return (
            <div className="flex items-center justify-center gap-x-1">
              {dataStore.split(',').map((store: string, id: string) => (
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
          );
        case 'actions':
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Dropdown aria-label="Dropdown Menu in Table">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="text-gray-600" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    aria-label="View Button"
                    onClick={() => {
                      router.push(
                        `/app/verifiable-credential/${encodeBase64url(
                          vc.metadata.id
                        )}`
                      );
                    }}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem aria-label="Share Button">Share</DropdownItem>
                  <DropdownItem
                    aria-label="Delete Button"
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedVC(vc);
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return 'test';
      }
    },
    []
  );

  // Set selected keys
  const handleSelect = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const getSelectedVCs = (keys: SelectedKeys) => {
    if (keys === 'all') {
      return vcs.map((vc) => vc.data);
    }
    if (keys === undefined) {
      return [];
    }
    return vcs
      .filter((vc) => (keys as Set<Key>).has(vc.metadata.id))
      .map((vc) => vc);
  };

  // get selected VCs from selected keys on change
  const selectedVCs = useMemo(() => {
    const selVcs = getSelectedVCs(selectedKeys);
    setSelectedVCs(selVcs);
    return selVcs;
  }, [selectedKeys]);

  // Set sorting descriptor
  const handleSorting = (sortDesc: SortDescriptor) => {
    setSortDescriptor(sortDesc);
  };

  // Run sort if sorting descriptor has changed
  const sortedCredentialList: QueryCredentialsRequestResult[] = useMemo(() => {
    if (!sortDescriptor) return vcs;
    return sortCredentialList(sortDescriptor, vcs);
  }, [sortDescriptor, vcs]);

  const pages = Math.ceil(sortedCredentialList.length / ROWS_PER_PAGE);

  const items: QueryCredentialsRequestResult[] = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return sortedCredentialList.slice(start, end);
  }, [page, sortedCredentialList]);

  return (
    <div className="h-full w-full">
      <Table
        aria-label="Credential Table"
        color="primary"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelect}
        onSortChange={handleSorting}
        sortDescriptor={sortDescriptor}
        topContent={
          <div className="dark:border-navy-blue-600 flex items-center justify-between p-5">
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
        }
        bottomContent={
          <div>
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                variant="light"
                page={page}
                total={pages}
                onChange={(newPage) => setPage(newPage)}
              />
            </div>
            {selectedVCs.length > 0 && (
              <div>
                <Button
                  color="primary"
                  size="lg"
                  className="rounded-full"
                  onClick={() => {
                    router.push('/app/create-verifiable-presentation');
                  }}
                >
                  Create Presentation ({selectedVCs.length})
                </Button>
              </div>
            )}
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn allowsSorting={column.allowSorting} key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.metadata.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default CredentialTable;
