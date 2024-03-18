import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

import { useAuthStore } from '@/stores';
import { Tables } from '@/utils/supabase/helper.types';
import Button from '../Button';
import { useDeletePresentation } from '@/hooks';

interface DeleteSharedPresentationModalProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  setPresentations: Dispatch<SetStateAction<Tables<'presentations'>[]>>;
  presentationId: string;
}

export const DeleteSharedPresentationModal = ({
  isModalOpen,
  presentationId,
  setModalOpen,
}: DeleteSharedPresentationModalProps) => {
  const t = useTranslations('DeleteSharedPresentationModal');

  const token = useAuthStore((state) => state.token);

  const { mutateAsync: deletePresentation, isPending } = useDeletePresentation(
    presentationId,
    token
  );

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
                  disabled={isPending}
                  loading={isPending}
                  onClick={async () =>
                    deletePresentation().finally(() => setModalOpen(false))
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
