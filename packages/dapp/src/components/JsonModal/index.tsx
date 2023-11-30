import { Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import Button from '../Button';

interface JsonModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  data: any;
}
const JsonModal = ({ isOpen, setOpen, data }: JsonModalProps) => {
  const t = useTranslations('JsonModal');

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
            <ModalBody>
              <div className="w-[48rem] max-w-full">
                <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-100 pr-2 pt-1">
                  <textarea
                    className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none"
                    disabled
                    value={JSON.stringify(data, null, 4)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="mt-10">
                  <Button
                    onClick={() => setOpen(false)}
                    variant="cancel"
                    size="xs"
                  >
                    {t('back')}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default JsonModal;
