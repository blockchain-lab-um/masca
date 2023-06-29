'use client';

import { isError } from '@blockchain-lab-um/utils';
import { Dialog } from '@headlessui/react';
import { VerifiableCredential } from '@veramo/core';

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
  const api = useMascaStore((state) => state.mascaApi);

  const handleCredentialOffer = async () => {
    if (!api) return;

    setOpen(false);

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Handling credential offer',
        type: 'normal',
        loading: true,
      });
    }, 200);

    const handleCredentialOfferResponse = await api.handleOIDCCredentialOffer({
      credentialOfferURI: credentialOffer,
    });

    useToastStore.setState({
      open: false,
    });

    if (isError(handleCredentialOfferResponse)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error while handling credential offer',
          type: 'error',
          loading: false,
        });
      }, 200);
      console.log(handleCredentialOfferResponse.error);
      return;
    }

    setRecievedCredential(handleCredentialOfferResponse.data);
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900"
      >
        New Credential Offer Recieved
      </Dialog.Title>
      <div className="mt-4">
        <p className="text-md dark:text-navy-blue-200 text-gray-500">
          You have recieved a new credential offer. Do you want to accept it?
        </p>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => setOpen(false)}
            variant="cancel"
            shadow="none"
            size="sm"
          >
            Cancel
          </Button>
          <Button onClick={handleCredentialOffer} variant="primary">
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CredentialOfferModal;
