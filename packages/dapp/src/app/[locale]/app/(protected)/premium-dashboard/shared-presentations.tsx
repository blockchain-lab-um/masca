'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';

import { DeleteSharedPresentationModal } from '@/components/DeleteSharedPresentationModal';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/helper.types';
import { useAuthStore } from '@/stores/authStore';

const queryPresentations = async (token: string) => {
  const supabase = createClient(token);
  const { data, error } = await supabase.from('presentations').select('*');

  if (error) throw new Error('Failed to fetch presentations');

  return data;
};

const keys = ['title', 'created_at', 'expires_at', 'actions', 'views'] as const;
const columns = [
  { key: 'title', label: 'Title' },
  { key: 'created_at', label: 'Created At' },
  { key: 'expires_at', label: 'Expires At' },
  { key: 'views', label: 'Views' },
  { key: 'actions', label: 'Actions' },
];

export const SharedPresentations = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [presentations, setPresentations] = useState<Tables<'presentations'>[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPresentationId, setSelectedPresentationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    queryPresentations(token)
      .then((data) => setPresentations(data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const renderCell = useCallback(
    (presentation: Tables<'presentations'>, columnKey: React.Key) => {
      const key = columnKey as (typeof keys)[number];

      switch (key) {
        case 'expires_at':
          return presentation.expires_at
            ? new Date(presentation.expires_at).toLocaleDateString()
            : 'Never';
        case 'created_at':
          return new Date(presentation.created_at).toLocaleDateString();
        case 'actions':
          return (
            <div className="flex w-full items-center justify-end space-x-4">
              <Tooltip content="Details">
                <div
                  className="text-md dark:text-navy-blue-50 cursor-pointer text-gray-600"
                  onClick={() =>
                    router.push(`/app/share-presentation/${presentation.id}`)
                  }
                >
                  <EyeIcon className="h-4 w-4" />
                </div>
              </Tooltip>
              <Tooltip color="danger" content="Delete presentation">
                <div
                  className="text-md dark:text-orange-accent-dark cursor-pointer text-pink-500"
                  onClick={() => {
                    setSelectedPresentationId(presentation.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </div>
              </Tooltip>
            </div>
          );
        default:
          return presentation[key];
      }
    },
    []
  );

  if (!token) return null;

  return (
    <>
      <div className="h-[50vh] min-h-[50vh]">
        <div className="flex w-full flex-col items-start justify-between space-y-2 px-4 sm:flex-row sm:items-end">
          <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl">
            Shared Presentations
          </h1>
          <div className="flex items-center space-x-1">
            <h3 className="dark:text-navy-blue-50 text-sm font-normal text-gray-800">
              Total shared presentations:
            </h3>
            <h3 className="font-ubuntu dark:text-orange-accent-dark sm:text-md text-md text-left text-pink-500 md:text-lg">
              6
            </h3>
          </div>
        </div>
        <div className="mt-2 h-full">
          <Table
            className="h-full"
            aria-label="Example table with dynamic content"
            isStriped
            bottomContent={<div className="text-center">PAGINATION</div>}
            classNames={{
              wrapper:
                'h-full rounded-2xl shadow-lg bg-white text-gray-800 dark:bg-navy-blue-700 dark:text-navy-blue-50',
              th: 'bg-pink-100 text-gray-800 dark:bg-navy-blue-900 dark:text-navy-blue-50 font-ubuntu font-medium text-md',
              td: 'group-data-[odd=true]:before:bg-pink-50 dark:group-data-[odd=true]:before:bg-navy-blue-800 font-ubuntu font-normal text-sm',
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className={clsx(
                    column.key === 'actions'
                      ? 'text-end'
                      : column.key === 'title'
                      ? 'text-start'
                      : 'text-center'
                  )}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={presentations}
              isLoading={loading}
              loadingContent={<Spinner />}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell
                      className={clsx(
                        columnKey === 'actions'
                          ? 'text-end'
                          : columnKey === 'title'
                          ? 'text-start'
                          : 'text-center'
                      )}
                    >
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteSharedPresentationModal
        isModalOpen={isDeleteModalOpen}
        presentationId={selectedPresentationId!}
        setModalOpen={setDeleteModalOpen}
        setPresentations={setPresentations}
      />
    </>
  );
};
