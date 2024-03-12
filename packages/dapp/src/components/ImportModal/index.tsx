import {
  type AvailableCredentialStores,
  isW3CCredential,
  isW3CVerifiableCredential,
} from '@blockchain-lab-um/masca-connector';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { W3CVerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { normalizeCredential } from 'did-jwt-vc';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Button from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import InfoIcon from '@/components/InfoIcon';
import { useMascaStore, useToastStore } from '@/stores';

interface ImportModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  importVC: (
    vc: string,
    stores: AvailableCredentialStores[]
  ) => Promise<boolean>;
}

function ImportModal({ isOpen, setOpen, importVC }: ImportModalProps) {
  const t = useTranslations('ImportModal');
  const [loading, setLoading] = useState(false);
  const [vc, setVC] = useState('');
  const credentialStores = useMascaStore(
    (state) => state.availableCredentialStores
  );
  const availableStores = Object.entries(credentialStores)
    .filter(([, value]) => value)
    .map(([key]) => key as AvailableCredentialStores);

  const [selectedItems, setSelectedItems] = useState<
    AvailableCredentialStores[]
  >([availableStores[0]]);

  const validateAndImportCredential = async (): Promise<void> => {
    setLoading(true);
    let vcObj: any;
    try {
      vcObj = JSON.parse(vc);
    } catch (err) {
      try {
        vcObj = normalizeCredential(vc) as W3CVerifiableCredential;
      } catch (normalizationError) {
        setLoading(false);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('save-error'),
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);

        return;
      }
    }

    if (!isW3CVerifiableCredential(vcObj) && !isW3CCredential(vcObj)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('save-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      setLoading(false);
      return;
    }
    const res = await importVC(vc, selectedItems);
    if (res) {
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="2xl"
      hideCloseButton={true}
      onClose={() => setOpen(false)}
      placement="center"
      className="main-bg py-2"
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
              <p className="text-md dark:text-navy-blue-200 text-gray-600">
                {t('desc')}
              </p>
              <div className="mt-5">
                <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-100 pr-2 pt-1">
                  <textarea
                    className={clsx(
                      'group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-300',
                      'scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono',
                      'min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none'
                    )}
                    value={vc}
                    onChange={(e) => setVC(e.target.value)}
                  />
                </div>
                <div className="text-h5 font-ubuntu dark:text-navy-blue-50 mt-8 text-center font-medium text-gray-800">
                  {t('settings')}
                </div>
                <div className="mt-2 flex items-center justify-between gap-x-8">
                  <span className="text-md dark:text-navy-blue-200 flex gap-x-1 text-gray-700">
                    {t('storage')} <InfoIcon content={t('storage-desc')} />
                  </span>
                  <div className="flex flex-1">
                    <DropdownMultiselect
                      items={availableStores}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      placeholder={t('select-storage-placeholder')}
                      name="storage"
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => setOpen(false)}
                variant="cancel"
                shadow="none"
                size="sm"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={validateAndImportCredential}
                variant="primary"
                size="sm"
                shadow="md"
                loading={loading}
              >
                {t('import')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ImportModal;
