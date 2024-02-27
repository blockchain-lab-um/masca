'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import { useEncryptedSessionStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

interface CreateConnectionModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CreateConnectionModal = ({
  isOpen,
  setOpen,
}: CreateConnectionModalProps) => {
  const t = useTranslations('CreateConnectionModal');

  // Local state
  const [connectionData, setConnectionData] = useState<string | null>(null);

  // Global state
  const { token, isSignedIn } = useAuthStore((state) => ({
    token: state.token,
    isSignedIn: state.isSignedIn,
  }));

  const {
    changeSession,
    changeSessionId,
    changeConnected,
    changeHasCamera,
    changeDeviceType,
  } = useEncryptedSessionStore((state) => ({
    changeSession: state.changeSession,
    changeSessionId: state.changeSessionId,
    changeConnected: state.changeConnected,
    changeHasCamera: state.changeHasCamera,
    changeDeviceType: state.changeDeviceType,
  }));

  const createSession = async (): Promise<string | null> => {
    if (!token || !isSignedIn) {
      return null;
    }

    // Create session ID
    const createSessionResult = await fetch('/api/encrypted-session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!createSessionResult.ok) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failsed to create session. Please try again.',
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);
      return null;
    }

    const { sessionId } = await createSessionResult.json();

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
    changeSessionId(sessionId);

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

    return () => {
      setConnectionData(null);
    };
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
                  {!connectionData && (
                    <Spinner className="h-[300px] w-[300px]" />
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
