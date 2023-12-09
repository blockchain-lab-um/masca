import React, { useMemo, useState } from 'react';
import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { useTranslations } from 'next-intl';

import StoreIcon from '@/components/StoreIcon';
import { convertTypes } from '@/utils/string';
import { useMascaStore, useTableStore } from '@/stores';
import {
  filterColumnsCredentialList,
  filterColumnsDataStore,
  filterColumnsEcosystem,
  filterColumnsType,
  sortCredentialList,
} from './utils';

type Key = string | number;
type SelectedKeys = 'all' | Iterable<Key> | undefined;

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

const CredentialTable = () => {
  const t = useTranslations('Dashboard');
  const [selectedKeys, setSelectedKeys] = useState<SelectedKeys>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [selectedCredentials, setSelectedCredentials] = useState<
    VerifiableCredential[]
  >([]);
  const { api, vcs, changeVcs, changeLastFetch } = useMascaStore((state) => ({
    api: state.mascaApi,
    vcs: state.vcs,
    changeVcs: state.changeVcs,
    changeLastFetch: state.changeLastFetch,
  }));

  const { globalFilter, cardView, dataStores, ecosystems, credentialTypes } =
    useTableStore((state) => ({
      globalFilter: state.globalFilter,
      cardView: state.cardView,
      dataStores: state.dataStores,
      ecosystems: state.ecosystems,
      credentialTypes: state.credentialTypes,
    }));

  // Load VCs
  const credentialList = useMemo(() => vcs, [vcs]);

  console.log('global filter', globalFilter);

  //   const renderCell = React.useCallback(
  //     (vc: QueryCredentialsRequestResult, columnKey: React.Key) => {
  //       switch (columnKey) {
  //         case 'type':
  //           // eslint-disable-next-line no-case-declarations
  //           const types = convertTypes(vc.data.type);
  //           console.log('types', types);
  //           return <span className="font-bold">{types}</span>;
  //         case 'date':
  //           // eslint-disable-next-line no-case-declarations
  //           const date = Date.parse(vc.data.issuanceDate);
  //           return (
  //             <span className="flex items-center justify-center">
  //               {new Date(date).toDateString()}
  //             </span>
  //           );
  //         default:
  //           return 'test';
  //       }
  //     },
  //     []
  //   );

  const renderCell = (
    vc: QueryCredentialsRequestResult,
    columnKey: React.Key
  ) => {
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
          status = (Date.now() < Date.parse(vc.data.expirationDate)).toString();
        return (
          <span className="flex items-center justify-center">
            <Tooltip
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
              content={`${
                vc.data.expirationDate === undefined
                  ? t('tooltip.no-exp-date')
                  : `${status === 'true' ? 'Expires' : 'Expired'} on ${new Date(
                      vc.data.expirationDate
                    ).toDateString()}`
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
        const dataStore = vc.metadata.store ? vc.metadata.store.toString() : '';
        return (
          <div className="flex items-center justify-center gap-x-1">
            {dataStore.split(',').map((store, id) => (
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
                <DropdownItem aria-label="View Button">View</DropdownItem>
                <DropdownItem aria-label="Share Button">Share</DropdownItem>
                <DropdownItem aria-label="Delete Button">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return 'test';
    }
  };

  // DS filter
  const dsFilteredCredentialList = useMemo(
    () => filterColumnsDataStore(credentialList, dataStores),
    [dataStores, credentialList]
  );

  // Type filter
  const dsFilteredCredentialType = useMemo(
    () => filterColumnsType(dsFilteredCredentialList, credentialTypes),
    [credentialTypes, dsFilteredCredentialList]
  );

  // Ecosystem filter
  const dsFilteredCredentialEcosystem = useMemo(
    () => filterColumnsEcosystem(dsFilteredCredentialType, ecosystems),
    [ecosystems, dsFilteredCredentialType]
  );

  // Global filter

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
      .map((vc) => vc.data);
  };

  // get selected VCs from selected keys on change
  const selectedVCs = useMemo(
    () => getSelectedVCs(selectedKeys),
    [selectedKeys]
  );

  // Set sorting descriptor
  const handleSorting = (sortDesc: SortDescriptor) => {
    setSortDescriptor(sortDesc);
  };

  // Run sort if sorting descriptor has changed
  const sortedCredentialList = useMemo(() => {
    if (!sortDescriptor) return dsFilteredCredentialEcosystem;
    return sortCredentialList(sortDescriptor, dsFilteredCredentialEcosystem);
  }, [sortDescriptor, dsFilteredCredentialEcosystem]);

  return (
    <div>
      <div>{selectedVCs.length}</div>
      <Table
        aria-label="Credential Table"
        color="primary"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelect}
        onSortChange={handleSorting}
        sortDescriptor={sortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn allowsSorting={column.allowSorting} key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedCredentialList}>
          {(item) => (
            <TableRow key={item.metadata.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CredentialTable;
