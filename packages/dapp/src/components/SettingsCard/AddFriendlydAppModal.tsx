import { useState } from 'react';
import { Dialog } from '@headlessui/react';

import Button from '@/components//Button';
import Modal from '@/components/Modal';
import InputField from '../InputField';

interface AddTrusteddAppModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addDapp: (dapp: string) => void;
}

function AddTrusteddAppModal({
  isOpen,
  setOpen,
  addDapp,
}: AddTrusteddAppModalProps) {
  const [dapp, setDapp] = useState('');
  return (
    <>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <Dialog.Title
          as="h3"
          className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800"
        >
          Add Trusted dapp
        </Dialog.Title>
        <div className="mt-4">
          <p className="text-md dark:text-navy-blue-200 mb-2 text-gray-700">
            Input the URL of the dapp you want to add.
          </p>
        </div>
        <InputField
          value={dapp}
          setValue={setDapp}
          variant="gray"
          rounded="lg"
        />
        <div className="flex items-center justify-end">
          <div className="mt-6">
            <Button onClick={() => setOpen(false)} variant="cancel" size="xs">
              Cancel
            </Button>
          </div>
          <div className="ml-2 mt-6">
            <Button
              onClick={() => {
                addDapp(dapp);
              }}
              variant="primary"
              size="xs"
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddTrusteddAppModal;
