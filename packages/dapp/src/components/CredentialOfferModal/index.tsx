'use client';

import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';

import Modal from '@/components/Modal';
import { useMascaStore } from '@/stores';

type CredentialOfferModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  credentialOffer: string;
};

const CredentialOfferModal = ({
  isOpen,
  setOpen,
  credentialOffer,
}: CredentialOfferModalProps) => {
  const api = useMascaStore((state) => state.mascaApi);

  useEffect(() => {
    if (!api) return;

    api
      .handleOIDCCredentialOffer({
        credentialOfferURI: credentialOffer,
      })
      .catch((error) => console.error);
  }, [api, credentialOffer]);

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
      >
        {credentialOffer}
      </Dialog.Title>
    </Modal>
  );
};

export default CredentialOfferModal;
