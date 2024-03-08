import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import type { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Button from '@/components/Button';

interface SelectCredentialsModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  credentials: VerifiableCredential[];
  selectCredentials: (credentials: VerifiableCredential[]) => void;
}

function SelectCredentialsModal({
  isOpen,
  setOpen,
  credentials,
  selectCredentials,
}: SelectCredentialsModalProps) {
  const t = useTranslations('SelectCredentialsModal');
  const [selectedCredentials, setSelectedCredentials] = useState<
    VerifiableCredential[]
  >([]);

  const handleConfirm = () => {
    selectCredentials(selectedCredentials);
    setOpen(false);
  };

  const handleSelectionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    credential: VerifiableCredential
  ) => {
    if (e.target.checked) {
      setSelectedCredentials([...selectedCredentials, credential]);
      return;
    }

    setSelectedCredentials(
      selectedCredentials.filter((c) => c.id !== credential.id)
    );
  };

  return (
    <Modal
      backdrop="blur"
      size="3xl"
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
              <div className="mt-4">
                <p className="text-md dark:text-navy-blue-200 text-center text-gray-500 ">
                  {t('desc')}
                </p>
                {credentials.map((credential, index) => (
                  <div
                    // key={index} // TODO: Is this ok
                    key={JSON.stringify(credential)}
                    className="mt-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => handleSelectionChange(e, credential)}
                      />
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="comments"
                          className="dark:text-navy-blue-50 font-medium text-gray-700"
                        >
                          {credential.name}
                        </label>
                        <p className="dark:text-navy-blue-200 space-x-1 text-gray-500">
                          {(credential.type as string[]).map((type) => (
                            <span key={type}>{type},</span>
                          ))}
                        </p>
                        <p className="dark:text-navy-blue-200 text-gray-500">
                          {credential.issuanceDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end">
                <div className="mt-10">
                  <Button
                    onClick={() => setOpen(false)}
                    variant="gray"
                    size="xs"
                  >
                    {t('cancel')}
                  </Button>
                </div>
                <div className="ml-2 mt-10">
                  <Button onClick={handleConfirm} variant="warning" size="xs">
                    {t('confirm')}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default SelectCredentialsModal;
