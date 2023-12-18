'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useTranslations } from 'next-intl';

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

const keys = ['title', 'created_at', 'expires_at', 'views', 'actions'] as const;

export const SharedPresentations = () => {
  const t = useTranslations('SharedPresentations');

  const router = useRouter();

  // Local state
  const [presentations, setPresentations] = useState<Tables<'presentations'>[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPresentationId, setSelectedPresentationId] = useState<
    string | null
  >(null);

  // Global state
  const token = useAuthStore((state) => state.token);

  // Functions
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
              <Tooltip content="View">
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

  const columns = useMemo(
    () =>
      keys.map((key) => ({
        key,
        label: t(`table-headers.${key}`),
      })),
    [t]
  );

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

  if (!token) return null;

  return (
    <>
      <div className="flex h-full flex-col p-4">
        <div className="flex w-full flex-col items-start justify-between p-5 sm:flex-row sm:items-end">
          <h1 className="text-h2 font-ubuntu dark:text-navy-blue-50 font-medium text-gray-800">
            {t('title')}
          </h1>
          <div className="flex items-center space-x-1">
            <h3>{t('total')}</h3>
            <h3 className="font-ubuntu dark:text-orange-accent-dark text-h4 text-left text-pink-500">
              {presentations.length}
            </h3>
          </div>
        </div>
        <Table
          className="h-full"
          aria-label="Example table with dynamic content"
          isStriped
          classNames={{
            wrapper: 'p-0 h-full shadow-none rounded-none',
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={clsx(
                  'dark:text-navy-blue-100',
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
        <div className="text-center">PAGINATION</div>
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
