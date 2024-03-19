import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { useAuthStore } from '@/stores';
import Button from '../Button';
import { useDeletePresentation } from '@/hooks';

interface DeleteSharedPresentationModalProps {
  isModalOpen: boolean;
  presentationId: string;
  page: number;
  setModalOpen: (isOpen: boolean) => void;
}

export const DeleteSharedPresentationModal = ({
  isModalOpen,
  presentationId,
  page,
  setModalOpen,
}: DeleteSharedPresentationModalProps) => {
  const t = useTranslations('DeleteSharedPresentationModal');

  const token = useAuthStore((state) => state.token);

  const { mutate: deletePresentation, isPending } =
    useDeletePresentation(token);

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
                  onClick={() => {
                    deletePresentation({
                      id: presentationId,
                      page,
                    });
                    setModalOpen(false);
                  }}
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
