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
import { encodeBase64url } from '@veramo/utils';
import { useTranslations } from 'next-intl';

import DeleteModal from '@/components/DeleteModal';
import StoreIcon from '@/components/StoreIcon';
import { removeCredentialSubjectFilterString } from '@/utils/format';
import { convertTypes } from '@/utils/string';
import { useTableStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { useShareModalStore } from '@/stores/shareModalStore';
import { LastFetched } from '../LastFetched';
import { sortCredentialList } from '../utils';

type Key = string | number;
type SelectedKeys = 'all' | Iterable<Key> | undefined;

const ROWS_PER_PAGE = 8;

interface CredentialTableProps {
  vcs: QueryCredentialsRequestResult[];
}

const IssuerCell = ({ vc }: { vc: QueryCredentialsRequestResult }) => {
  const t = useTranslations('CredentialTable');
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
};

const CredentialTable = ({ vcs }: CredentialTableProps) => {
  const t = useTranslations('CredentialTable');

  const router = useRouter();

  // Local state
  const [selectedKeys, setSelectedKeys] = useState<SelectedKeys>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDeleteCredential, setSelectedDeleteCredential] =
    useState<QueryCredentialsRequestResult>();

  // Global state
  const setSelectedCredentials = useTableStore(
    (state) => state.setSelectedCredentials
  );

  const { isSignedIn, changeIsSignInModalOpen } = useAuthStore((state) => ({
    isSignedIn: state.isSignedIn,
    changeIsSignInModalOpen: state.changeIsSignInModalOpen,
  }));

  const { setShareModalMode, setIsShareModalOpen, setShareCredentials } =
    useShareModalStore((state) => ({
      setShareModalMode: state.setMode,
      setIsShareModalOpen: state.setIsOpen,
      setShareCredentials: state.setCredentials,
    }));

  const columns = [
    {
      key: 'type',
      label: t('table-header.type'),
      allowSorting: true,
    },
    {
      key: 'date',
      label: t('table-header.date'),
      allowSorting: true,
    },
    {
      key: 'subject',
      label: t('table-header.subject'),
      allowSorting: true,
    },
    {
      key: 'issuer',
      label: t('table-header.issuer'),
      allowSorting: true,
    },
    {
      key: 'exp_date',
      label: t('table-header.exp_date'),
      allowSorting: true,
    },
    {
      key: 'status',
      label: t('table-header.status'),
    },
    {
      key: 'data_store',
      label: t('table-header.data_store'),
    },
    {
      key: 'actions',
      label: t('table-header.actions'),
    },
  ];

  const renderCell = React.useCallback(
    (vc: QueryCredentialsRequestResult, columnKey: React.Key) => {
      let status = true;

      switch (columnKey) {
        case 'type':
          return (
            <span className="font-bold">
              {convertTypes(vc.data.type).split(',')[0]}
            </span>
          );
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
          return <IssuerCell vc={vc} />;
        case 'exp_date':
          return (
            <span className="flex items-center justify-center">
              {vc.data.expirationDate === undefined
                ? '/'
                : new Date(vc.data.expirationDate).toDateString()}
            </span>
          );
        case 'status':
          if (vc.data.expirationDate)
            status = Date.now() < Date.parse(vc.data.expirationDate);
          return (
            <span className="flex items-center justify-center">
              <Tooltip
                className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                content={`${
                  vc.data.expirationDate === undefined
                    ? t('tooltip.no-exp-date')
                    : `${status ? 'Expires' : 'Expired'} on ${new Date(
                        vc.data.expirationDate
                      ).toDateString()}`
                }`}
              >
                {status ? (
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
              {dataStore.split(',').map((store: string, id: number) => (
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
              <Dropdown isDismissable>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="dark:text-navy-blue-300 text-gray-600" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label={t('menu.menu')}>
                  <DropdownItem
                    key={t('menu.view')}
                    aria-label={t('menu.view')}
                    onClick={() => {
                      router.push(
                        `/app/verifiable-credential/${encodeBase64url(
                          vc.metadata.id
                        )}`
                      );
                    }}
                  >
                    {t('menu.view')}
                  </DropdownItem>
                  <DropdownItem
                    key={t('menu.share')}
                    aria-label={t('menu.share')}
                    onClick={() => {
                      if (!isSignedIn) {
                        changeIsSignInModalOpen(true);
                        return;
                      }
                      setShareCredentials([
                        removeCredentialSubjectFilterString(vc).data,
                      ]);
                      setShareModalMode('single');
                      setIsShareModalOpen(true);
                    }}
                  >
                    {t('menu.share')}
                  </DropdownItem>
                  <DropdownItem
                    aria-label={t('menu.delete')}
                    key={t('menu.delete')}
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedDeleteCredential(vc);
                    }}
                  >
                    {t('menu.delete')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return '';
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
      return vcs;
    }
    if (keys === undefined) {
      return [];
    }
    return vcs.filter((vc) => (keys as Set<Key>).has(vc.metadata.id));
  };

  // get selected VCs from selected keys on change
  const selectedVCs = useMemo(() => {
    const selVcs = getSelectedVCs(selectedKeys);
    setSelectedCredentials(selVcs);
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

  // Get items for current page when page or sortDescriptor changes
  const items: QueryCredentialsRequestResult[] = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    const newItems = sortedCredentialList.slice(start, end);

    return newItems;
  }, [sortDescriptor, page, vcs]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Table
        border={0}
        shadow={'none'}
        aria-label="Credential Table"
        color="primary"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelect}
        onSortChange={handleSorting}
        sortDescriptor={sortDescriptor}
        topContent={
          <div className="dark:border-navy-blue-600 flex items-center justify-between p-5">
            <div className="text-h2 font-ubuntu dark:text-navy-blue-50 font-medium text-gray-800">
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
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="dark:text-navy-blue-100"
              allowsSorting={column.allowSorting}
              key={column.key}
            >
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

      <div className="flex w-full items-center justify-between px-9 pb-8">
        <div className="w-1/3 "></div>
        <div className="flex h-[40px] w-1/3 items-center justify-center">
          <Pagination
            isCompact
            showControls
            showShadow={false}
            color="primary"
            variant="flat"
            page={page}
            total={pages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
        <div className="flex w-1/3 items-center justify-end">
          {selectedVCs.length > 0 && (
            <Button
              color="primary"
              size="md"
              className="rounded-full"
              onClick={() => {
                router.push('/app/create-verifiable-presentation');
              }}
            >
              {t('create-verifiable-presentation')} ({selectedVCs.length})
            </Button>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        vc={selectedDeleteCredential}
      />
    </div>
  );
};

export default CredentialTable;
