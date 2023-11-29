'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';

import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/helper.types';
import { useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

const queryPresentations = async (token: string) => {
  const supabase = createClient(token);
  const { data, error } = await supabase.from('presentations').select('*');

  if (error) throw new Error('Failed to fetch presentations');

  return data;
};

const deletePresentation = async (token: string, id: string) => {
  const supabase = createClient(token);
  const { error } = await supabase.from('presentations').delete().match({ id });

  if (error) throw new Error('Failed to delete presentation');
};

const keys = ['name', 'created_at', 'expires_at', 'actions'] as const;
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'created_at', label: 'Created At' },
  { key: 'expires_at', label: 'Expires At' },
  { key: 'actions', label: 'Actions' },
];

export const SharedPresentations = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [presentations, setPresentations] = useState<Tables<'presentations'>[]>(
    []
  );

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deletePresentation(token, id);
      setPresentations((prev) => prev.filter((p) => p.id !== id));

      useToastStore.setState({
        open: false,
      });

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Successfully deleted presentation',
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    } catch (error) {
      console.error(error);

      useToastStore.setState({
        open: false,
      });

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failed to delete presentation',
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  useEffect(() => {
    if (!token) return;
    console.log('Fetching presentations');
    queryPresentations(token)
      .then((data) => setPresentations(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderCell = useCallback(
    (presentation: Tables<'presentations'>, columnKey: React.Key) => {
      const key = columnKey as (typeof keys)[number];

      switch (key) {
        case 'name':
          return 'test123';
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span
                  className="text-default-400 cursor-pointer text-lg active:opacity-50"
                  onClick={() =>
                    router.push(`/app/share-presentation/${presentation.id}`)
                  }
                >
                  <EyeIcon className="h-4 w-4" />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span className="text-default-400 cursor-pointer text-lg active:opacity-50">
                  <PencilSquareIcon className="h-4 w-4" />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-danger cursor-pointer text-lg active:opacity-50"
                  onClick={() => handleDelete(presentation.id)}
                >
                  <TrashIcon className="h-6 w-6" />
                </span>
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
    <div className="min-h-[50vh] p-6">
      <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-800">
        Shared Presentations
      </div>
      <div className="mt-6">
        <Table aria-label="Example table with dynamic content" isStriped>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                align={column.key === 'actions' ? 'center' : 'start'}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={presentations}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
