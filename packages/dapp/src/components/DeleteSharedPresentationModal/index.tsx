import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

import { useToastStore, useAuthStore } from '@/stores';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/helper.types';
import Button from '../Button';

interface DeleteSharedPresentationModalProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  setPresentations: Dispatch<SetStateAction<Tables<'presentations'>[]>>;
  presentationId: string;
}

const deletePresentation = async (token: string, id: string) => {
  const supabase = createClient(token);
  const { error } = await supabase.from('presentations').delete().match({ id });

  if (error) throw new Error('Failed to delete presentation');
};

export const DeleteSharedPresentationModal = ({
  isModalOpen,
  presentationId,
  setModalOpen,
  setPresentations,
}: DeleteSharedPresentationModalProps) => {
  const t = useTranslations('DeleteSharedPresentationModal');

  const token = useAuthStore((state) => state.token);
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
          title: t('delete-success'),
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
          title: t('delete-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  return (
    <Modal
      backdrop="blur"
      size="xl"
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      hideCloseButton={true}
      placement="center"
      className="main-bg mx-4 py-2"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="text-h3 font-ubuntu dark:text-navy-blue-50 w-full text-center font-medium leading-6 text-gray-900">
                {t('title')}
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-md dark:text-navy-blue-200 text-center text-gray-600">
                {t('description')}
              </p>
              <div className="mt-10 flex w-full justify-end">
                <Button
                  size="xs"
                  variant="cancel"
                  onClick={() => setModalOpen(false)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  size="xs"
                  variant="warning"
                  onClick={async () =>
                    handleDelete(presentationId).finally(() =>
                      setModalOpen(false)
                    )
                  }
                >
                  {t('delete')}
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
