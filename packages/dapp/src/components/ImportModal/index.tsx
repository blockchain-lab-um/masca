import { useState } from 'react';
import { AvailableVCStores } from '@blockchain-lab-um/masca-types';
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import InfoIcon from '@/components/InfoIcon';
import Modal from '@/components/Modal';
import { checkVCType } from '@/utils/typia-generated';
import { useMascaStore, useToastStore } from '@/stores';

interface ImportModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  importVC: (vc: string, stores: AvailableVCStores[]) => Promise<boolean>;
}

function ImportModal({ isOpen, setOpen, importVC }: ImportModalProps) {
  const t = useTranslations('ImportModal');
  const [loading, setLoading] = useState(false);
  const [vc, setVC] = useState('');
  const VCStores = useMascaStore((state) => state.availableVCStores);
  const availableStores = Object.keys(VCStores).filter(
    (key) => VCStores[key] === true
  );
  const [selectedItems, setSelectedItems] = useState<AvailableVCStores[]>([
    availableStores[0] as AvailableVCStores,
  ]);
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="text-h3 font-ubuntu dark:text-navy-blue-50 font-medium leading-6 text-gray-800"
      >
        {t('title')}
      </Dialog.Title>
      <div className="mt-5">
        <p className="text-md dark:text-navy-blue-200 text-gray-600">
          {t('desc')}
        </p>
      </div>
      <div className="mt-5">
        <div className="dark:bg-navy-blue-400 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-100 pr-2 pt-1">
          <textarea
            className={clsx(
              'group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-400',
              'scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono',
              'min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none'
            )}
            value={vc}
            onChange={(e) => setVC(e.target.value)}
          />
        </div>
        <div className="text-h5 font-ubuntu dark:text-navy-blue-50 mt-8 font-medium text-gray-800">
          {t('settings')}
        </div>
        <div className="mt-2 flex items-center justify-between gap-x-8">
          <span className="text-md dark:text-navy-blue-200 flex gap-x-1 text-gray-700">
            {t('storage')} <InfoIcon>{t('storage-desc')}</InfoIcon>
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
      <div className="mt-8 flex items-center justify-end">
        <div className="mt-4">
          <Button
            onClick={() => setOpen(false)}
            variant="cancel"
            shadow="none"
            size="sm"
          >
            {t('cancel')}
          </Button>
        </div>

        <div className="ml-2 mt-4">
          <Button
            onClick={async () => {
              setLoading(true);
              if (!checkVCType(JSON.parse(vc))) {
                setTimeout(() => {
                  useToastStore.setState({
                    open: true,
                    title: 'Invalid verifiable credential type',
                    type: 'error',
                    loading: false,
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
            }}
            variant="primary"
            size="sm"
            shadow="md"
            loading={loading}
          >
            {t('import')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImportModal;
