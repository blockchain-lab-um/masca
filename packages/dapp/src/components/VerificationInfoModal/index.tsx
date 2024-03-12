'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';

interface VerificationInfoModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const VerificationInfoModal = ({
  isOpen,
  setOpen,
}: VerificationInfoModalProps) => {
  const t = useTranslations('VerificationInfoModal');

  return (
    <Modal
      backdrop="blur"
      size="xl"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
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
              <h2>{t('subtitle')}</h2>
              <ul className="list-disc space-y-1 pl-8 text-sm">
                <li>{t('list.presentation-signature')}</li>
                <li>{t('list.credential-signature')}</li>
                <li>{t('list.credential-schema')}</li>
                <li>{t('list.expiration-date')}</li>
                <li>{t('list.valid-from-date')}</li>
                <li>{t('list.credential-status')}</li>
              </ul>
              <div className="mt-4 flex items-center justify-end">
                <Button onClick={() => setOpen(false)} variant="done" size="sm">
                  {t('close')}
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
