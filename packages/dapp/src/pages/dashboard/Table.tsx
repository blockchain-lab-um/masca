/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import Button from 'src/components/Button';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { useSnapStore, useGeneralStore } from '../../utils/store';

type VC = {
  id: string;
  type: string;
  holder: string;
  issuer: string;
  attributes: number;
  status: boolean;
  datastore: string[];
};

export const Table = () => {
  const vcs = useSnapStore((state) => state.vcs);
  const changeVcs = useSnapStore((state) => state.changeVcs);
  const api = useSnapStore((state) => state.snapApi);
  const data = React.useMemo(() => vcs, []);

  const columnHelper = createColumnHelper<QueryVCsRequestResult>();

  const columns = [
    columnHelper.accessor((row) => row.metadata.id, {
      id: 'id',
      cell: (info) => (
        <span>{`${info.getValue().slice(0, 5)}....${info
          .getValue()
          .slice(-5)}`}</span>
      ),
      header: () => <span>ID</span>,
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
        cell: (info) => <span>{info.getValue()}</span>,
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
      (row) => Object.keys(row.data.credentialSubject).length,
      {
        id: 'attributes',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Attributes</span>,
      }
    ),
    columnHelper.accessor((row) => row.metadata.id, {
      id: 'status',
      cell: (info) => <span>Valid</span>,
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor((row) => row.metadata.id, {
      id: 'data_store',
      cell: (info) => (
        <span>{`${info.getValue().slice(0, 5)}....${info
          .getValue()
          .slice(-5)}`}</span>
      ),
      header: () => <span>Data Store</span>,
    }),
    columnHelper.display({
      id: 'select',
      cell: () => <span>+</span>,
      header: () => <span>Select</span>,
    }),
    columnHelper.display({
      id: 'action',
      cell: () => <span>btn1 btn2 btn3</span>,
      header: () => <span>Actions</span>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
    </>
  );
};
