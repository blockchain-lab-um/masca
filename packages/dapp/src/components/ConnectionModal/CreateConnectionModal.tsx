'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import { useEncryptedSessionStore } from '@/stores';

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
  const {
    request,
    session,
    changeRequest,
    changeSession,
    changeChannelId,
    changeConnected,
    changeHasCamera,
    changeDeviceType,
  } = useEncryptedSessionStore((state) => ({
    request: state.request,
    session: state.session,
    changeRequest: state.changeRequest,
    changeSession: state.changeSession,
    changeChannelId: state.changeChannelId,
    changeConnected: state.changeConnected,
    changeHasCamera: state.changeHasCamera,
    changeDeviceType: state.changeDeviceType,
  }));

  const createSession = async (): Promise<string> => {
    // Create session ID
    const channelId = crypto.randomUUID();

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
    changeSession({
      key,
      exp,
    });
    changeConnected(false);
    changeHasCamera(false);
    changeDeviceType('primary');
    changeChannelId(channelId);

    // Create session
    return JSON.stringify({
      channelId,
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
    <Modal
      backdrop="blur"
      size="xl"
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
              <p className="text-md dark:text-navy-blue-200 text-center text-gray-600">
                {t('desc')}
              </p>
              <div className="flex w-full justify-center p-4 pt-8">
                <div className="dark:border-orange-accent-dark rounded-xl border-2 border-pink-500 bg-white p-4">
                  {connectionData && (
                    <QRCodeSVG
                      value={connectionData}
                      height={300}
                      width={300}
                    />
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateConnectionModal;
