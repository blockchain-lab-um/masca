import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import CreateConnectionModal from '@/components/ConnectionModal/CreateConnectionModal';
import ScanQRCodeModal from '@/components/ScanQRCodeModal/ScanQRCodeModal';
import { useEncryptedSessionStore, useToastStore } from '@/stores';

export const ConnectDeviceView = () => {
  const t = useTranslations('ConnectDeviceView');
  const { isConnected } = useAccount();
  const {
    session,
    connected,
    deviceType,
    hasCamera,
    changeSession,
    changeConnected,
    changeChannelId,
  } = useEncryptedSessionStore((state) => ({
    session: state.session,
    connected: state.connected,
    deviceType: state.deviceType,
    hasCamera: state.hasCamera,
    changeSession: state.changeSession,
    changeConnected: state.changeConnected,
    changeChannelId: state.changeChannelId,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  useEffect(() => {
    // Close connect QR modal if connection is established
    if (connected && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [connected]);

  const onScanSuccessConnectionQRCode = async (decodedText: string, _: any) => {
    if (isConnectionModalOpen) {
      setIsConnectionModalOpen(false);
    }
    // Close if already connected
    if (connected) return;

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
        key: decryptionKey,
        exp: data.exp,
      });
      changeConnected(true);
      changeChannelId(data.channelId);

      // const response = await fetch(`/api/qr-code-session/${data.sessionId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data: uint8ArrayToHex(encryptedData),
      //     iv: uint8ArrayToHex(iv),
      //   }),
      // });

      // if (!response.ok) throw new Error();

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
      {deviceType === 'primary' && !hasCamera && (
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
      {hasCamera && (
        <>
          {deviceType === 'secondary' && (
            <>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>{t('start-secondary')}</div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    // Reset session if already set
                    changeChannelId(null);
                    changeSession({
                      key: null,
                      exp: null,
                    });
                    changeConnected(false);
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
