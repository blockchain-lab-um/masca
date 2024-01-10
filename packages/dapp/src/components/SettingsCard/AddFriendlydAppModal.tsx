import { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import Button from '@/components//Button';
import InputField from '../InputField';

interface AddFriendlydAppModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addDapp: (dapp: string) => void;
}

function AddFriendlydAppModal({
  isOpen,
  setOpen,
  addDapp,
}: AddFriendlydAppModalProps) {
  const [dapp, setDapp] = useState('');
  return (
    <>
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
                  Add Friendly dapp
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="mt-4">
                  <p className="text-md dark:text-navy-blue-200 mb-2 text-center text-gray-700">
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
                    <Button
                      onClick={() => setOpen(false)}
                      variant="cancel"
                      size="xs"
                    >
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddFriendlydAppModal;
