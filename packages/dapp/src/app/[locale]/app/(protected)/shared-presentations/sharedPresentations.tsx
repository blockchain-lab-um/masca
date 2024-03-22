'use client';

import { EyeIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  Pagination,
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
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { DeleteSharedPresentationModal } from '@/components/DeleteSharedPresentationModal';
import { ShareCredentialModal } from '@/components/ShareCredentialModal';
import { useAuthStore, useShareModalStore } from '@/stores';
import type { Tables } from '@/utils/supabase/helper.types';
import {
  useTotalPresentations,
  usePresentations,
  ITEMS_PER_PAGE,
} from '@/hooks';

export const SharedPresentations = () => {
  const t = useTranslations('SharedPresentations');

  const router = useRouter();

  // Global state
  const { isSignedIn, token, changeIsSignInModalOpen } = useAuthStore(
    (state) => ({
      isSignedIn: state.isSignedIn,
      changeIsSignInModalOpen: state.changeIsSignInModalOpen,
      token: state.token,
    })
  );

  const { setShareLink, setShareModalMode, setIsShareModalOpen } =
    useShareModalStore((state) => ({
      setShareLink: state.setShareLink,
      setShareModalMode: state.setMode,
      setIsShareModalOpen: state.setIsOpen,
    }));

  // Local state
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPresentationId, setSelectedPresentationId] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);

  const columns = [
    {
      key: 'title',
      label: t('table-header.title'),
    },
    {
      key: 'created_at',
      label: t('table-header.created_at'),
    },
    {
      key: 'expires_at',
      label: t('table-header.expires_at'),
    },
    {
      key: 'views',
      label: t('table-header.views'),
    },
    {
      key: 'actions',
      label: t('table-header.actions'),
    },
  ];

  // Functions
  const renderCell = useCallback(
    (presentation: Tables<'presentations'>, columnKey: React.Key) => {
      switch (columnKey) {
        case 'expires_at':
          return presentation.expires_at
            ? new Date(presentation.expires_at).toLocaleDateString()
            : 'Never';
        case 'created_at':
          return new Date(presentation.created_at).toLocaleDateString();
        case 'actions':
          return (
            <div className="flex w-full items-center justify-end space-x-4">
              <Tooltip content="Share">
                <button
                  type="button"
                  className={clsx(
                    'dark:text-navy-blue-50 group flex',
                    'items-center justify-center rounded-full text-gray-700 outline-none focus:outline-none'
                  )}
                  onClick={() => {
                    if (!isSignedIn) {
                      changeIsSignInModalOpen(true);
                      return;
                    }
                    setShareModalMode('multiple');
                    setShareLink(
                      `${window.location.origin}/app/share-presentation/${presentation.id}`
                    );
                    setIsShareModalOpen(true);
                  }}
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
              </Tooltip>
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
          return presentation[
            columnKey as keyof Omit<Tables<'presentations'>, 'presentation'>
          ];
      }
    },
    []
  );

  if (!token) return null;

  // Total presentations
  const {
    data: { total },
  } = useTotalPresentations(token);

  // Calculate number of pages
  const pages = Math.ceil(total / ITEMS_PER_PAGE);

  // Presentations
  const { data: presentationsData, status } = usePresentations(token, page);
  const presentations = useMemo(
    () => (presentationsData ? presentationsData.presentations : []),
    [presentationsData]
  );

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden p-4">
        <div className="flex w-full flex-col items-start justify-between p-5 sm:flex-row sm:items-end">
          <h1 className="text-h2 font-ubuntu dark:text-navy-blue-50 font-medium text-gray-800">
            {t('title')}
          </h1>
          <div className="flex items-center space-x-1">
            <h3>{t('total')}</h3>
            <h3 className="font-ubuntu dark:text-orange-accent-dark text-h4 text-left text-pink-500">
              {total}
            </h3>
          </div>
        </div>
        <Table
          className="h-full overflow-auto"
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
            isLoading={status === 'pending'}
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
        <div className="flex w-full justify-center">
          {pages > 1 && (
            <Pagination
              isCompact
              showControls
              showShadow={false}
              color="primary"
              variant="flat"
              total={pages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </div>
      <DeleteSharedPresentationModal
        isModalOpen={isDeleteModalOpen}
        presentationId={selectedPresentationId!}
        setModalOpen={setDeleteModalOpen}
        page={page}
      />
      <ShareCredentialModal />
    </>
  );
};
