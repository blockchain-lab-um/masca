'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import Modal from '@/components/Modal';
import { useSessionStore } from '@/stores';

interface CreateConnectionModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CreateConnectionModal = ({
  isOpen,
  setOpen,
}: CreateConnectionModalProps) => {
  const t = useTranslations('CreateConnectionModal');
  const [connectionData, setConnectionData] = useState<string | null>(null);
  const { changeSessionId, changeKey, changeExp } = useSessionStore(
    (state) => ({
      changeSessionId: state.changeSessionId,
      changeKey: state.changeKey,
      changeExp: state.changeExp,
    })
  );

  const createSession = async (): Promise<string> => {
    // Create session ID
    const sessionId = crypto.randomUUID();

    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export key data
    const keyData = await crypto.subtle.exportKey('jwk', key);

    // Set expiration date (1 hour from now)
    const exp = Date.now() + 1000 * 60 * 60;

    // Set global session data
    changeSessionId(sessionId);
    changeKey(key);
    changeExp(exp);

    // Create session
    return JSON.stringify({
      sessionId,
      keyData,
      exp,
    });
  };

  useEffect(() => {
    if (isOpen) {
      createSession()
        .then((data) => setConnectionData(data))
        .catch(console.error);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
      >
        {t('title')}
      </Dialog.Title>
      <p>
        Scan this with your mobile device to create a connection to this page.
      </p>
      <div className="flex w-full justify-center p-4 pt-8">
        <div className="dark:border-orange-accent-dark rounded-xl border-2 border-pink-500 bg-white p-4">
          {connectionData && (
            <QRCodeSVG value={connectionData} height={300} width={300} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateConnectionModal;
