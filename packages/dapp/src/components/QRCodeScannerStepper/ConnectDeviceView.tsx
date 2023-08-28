import React, { useEffect, useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import CreateConnectionModal from '@/components/ConnectionModal/CreateConnectionModal';
import ScanQRCodeModal from '@/components/ScanQRCodeModal/ScanQRCodeModal';
import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';

export const ConnectDeviceView = () => {
  const t = useTranslations('ConnectDeviceView');
  const isConnected = useGeneralStore((state) => state.isConnected);
  const { session, changeSession } = useSessionStore((state) => ({
    session: state.session,
    changeSession: state.changeSession,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  useEffect(() => {
    // Close connect QR modal if connection is established
    if (session.connected && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [session.connected]);

  const onScanSuccessConnectionQRCode = async (decodedText: string, _: any) => {
    if (isConnectionModalOpen) {
      setIsConnectionModalOpen(false);
    }
    // Close if already connected
    if (session.connected) return;

    try {
      const data = JSON.parse(decodedText);

      if (!data.sessionId || !data.keyData || !data.exp) throw new Error();

      const decryptionKey = await crypto.subtle.importKey(
        'jwk',
        data.keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      changeSession({
        ...session,
        sessionId: data.sessionId,
        key: decryptionKey,
        exp: data.exp,
        connected: true,
      });

      // Encrypt data
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encodedText = new TextEncoder().encode('Created Connection');

      const encryptedData = new Uint8Array(
        await crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          decryptionKey,
          encodedText
        )
      );
      const response = await fetch(`/api/qr-code-session/${data.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: uint8ArrayToHex(encryptedData),
          iv: uint8ArrayToHex(iv),
        }),
      });

      if (!response.ok) throw new Error();

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('invalid'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  return (
    <div className="">
      {session.deviceType === 'primary' && !session.hasCamera && (
        <>
          {isConnected && (
            <>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>{t('start-primary')}</div>
                <div className="mt-2">
                  {`Press the 'Create Connection' button below and Scan the QR
                  code on your secondary device`}
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  {t('create')}
                </Button>
              </div>
            </>
          )}
          {!isConnected && <div>{t('connect')}</div>}
        </>
      )}
      {session.hasCamera && (
        <>
          {session.deviceType === 'secondary' && (
            <>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>{t('start-secondary')}</div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsConnectionModalOpen(true);
                  }}
                >
                  {t('scan')}
                </Button>
              </div>
            </>
          )}
        </>
      )}
      <CreateConnectionModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessConnectionQRCode}
        title={'Scan Connection'}
        isOpen={isConnectionModalOpen}
        setOpen={setIsConnectionModalOpen}
      />
    </div>
  );
};
