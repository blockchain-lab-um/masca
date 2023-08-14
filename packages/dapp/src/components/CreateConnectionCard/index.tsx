'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import { useGeneralStore } from '@/stores';
import CreateConnectionModal from './CreateConnectionModal';

const CreateConnectionCard = () => {
  const t = useTranslations('CreateConnectionCard');
  const isConnected = useGeneralStore((state) => state.isConnected);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="text-h3 font-ubuntu font-semibold">Browser</div>
        <div className="flex-1 space-y-2">
          <p>{t('desc-1')}</p>
          <p>{t('desc-2')}</p>
          <p>{t('desc-3')}</p>
        </div>
        <div className="flex justify-center">
          <Button
            variant={isConnected ? 'primary' : 'gray'}
            onClick={() => setIsModalOpen(true)}
            disabled={!isConnected}
          >
            {t('create-connection')}
          </Button>
        </div>
      </div>
      <CreateConnectionModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default CreateConnectionCard;
