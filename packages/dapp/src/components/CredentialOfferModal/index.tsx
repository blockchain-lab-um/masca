'use client';

import { isError } from '@blockchain-lab-um/masca-connector';
import { Dialog } from '@headlessui/react';
import { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useMascaStore, useToastStore } from '@/stores';

type CredentialOfferModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  credentialOffer: string;
  setRecievedCredential: (credential: VerifiableCredential) => void;
};

const CredentialOfferModal = ({
  isOpen,
  setOpen,
  credentialOffer,
  setRecievedCredential,
}: CredentialOfferModalProps) => {
  const t = useTranslations('CredentialOfferModal');
  const api = useMascaStore((state) => state.mascaApi);

  const handleCredentialOffer = async () => {
    if (!api) return;

    setOpen(false);

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('handling'),
        type: 'normal',
        loading: true,
      });
    }, 200);

    const handleCredentialOfferResponse = await api.handleCredentialOffer({
      credentialOffer,
    });

    useToastStore.setState({
      open: false,
    });

    if (isError(handleCredentialOfferResponse)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('handling-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      console.log(handleCredentialOfferResponse.error);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('handling-success'),
        type: 'success',
        loading: false,
      });
    }, 200);

    console.log(handleCredentialOfferResponse.data);

    // TODO: Handle multiple credentials
    setRecievedCredential(handleCredentialOfferResponse.data[0]);
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900"
      >
        {t('title')}
      </Dialog.Title>
      <div className="mt-4">
        <p className="text-md dark:text-navy-blue-200 text-gray-500">
          {t('desc')}
        </p>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => setOpen(false)}
            variant="cancel"
            shadow="none"
            size="sm"
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleCredentialOffer} variant="primary">
            {t('proceed')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CredentialOfferModal;
