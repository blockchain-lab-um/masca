import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import InputField from '../InputField';

interface AddTrustedDappModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addDapp: (dapp: string) => void;
}

function AddTrustedDappModal({
  isOpen,
  setOpen,
  addDapp,
}: AddTrustedDappModalProps) {
  const [dapp, setDapp] = useState('');
  const t = useTranslations('AddTrustedDappModal');
  return (
    <>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <Dialog.Title
          as="h3"
          className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800"
        >
          {t('add-title')}
        </Dialog.Title>
        <div className="mt-4">
          <p className="text-md dark:text-navy-blue-200 mb-2 text-gray-700">
            {t('input-url')}
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
              {t('cancel')}
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
              {t('add')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddTrustedDappModal;
