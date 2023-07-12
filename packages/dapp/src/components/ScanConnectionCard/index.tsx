'use client';

import { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useSessionStore, useToastStore } from '@/stores';
import Button from '../Button';
import ScanQRCodeModal from './ScanQRCodeModal';

const ScanConnectionCard = () => {
  const t = useTranslations('ScanConnectionCard');
  const { sessionId, key, exp } = useSessionStore(
    (state) => ({
      sessionId: state.sessionId,
      key: state.key,
      exp: state.exp,
    }),
    shallow
  );

  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const onScanSuccessConnectionQRCode = async (decodedText: string, _: any) => {
    setIsConnectionModalOpen(false);

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

      useSessionStore.setState({
        sessionId: data.sessionId,
        key: decryptionKey,
        exp: data.exp,
      });

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('connection-created'),
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('invalid-qr-code'),
          type: 'error',
          loading: false,
        });
      }, 200);
    }
  };

  const onScanSuccessQRCode = async (decodedText: string, _: any) => {
    if (!sessionId || !key || !exp) return;
    setIsQRCodeModalOpen(false);

    try {
      if (
        !decodedText.startsWith('openid-credential-offer://') &&
        !decodedText.startsWith('openid://')
      ) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('unsuported-qr-code'),
            type: 'error',
            loading: false,
          });
        }, 200);

        return;
      }

      // Encrypt data
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encodedText = new TextEncoder().encode(decodedText);

      const encryptedData = new Uint8Array(
        await crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          encodedText
        )
      );

      // Send data
      const response = await fetch(`/api/qr-code-session/${sessionId}`, {
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
          title: t('qr-data-sent'),
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('unexpected-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex-1 space-y-2">
          <p>{t('desc')}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => setIsConnectionModalOpen(true)}
          >
            {t('scan-connection')}
          </Button>
          <Button
            variant={sessionId ? 'primary' : 'gray'}
            onClick={() => setIsQRCodeModalOpen(true)}
            disabled={!sessionId}
          >
            {t('scan-qr-code')}
          </Button>
        </div>
      </div>
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessConnectionQRCode}
        title={t('scan-connection-modal-title')}
        isOpen={isConnectionModalOpen}
        setOpen={setIsConnectionModalOpen}
      />
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessQRCode}
        title={t('scan-qr-code-modal-title')}
        isOpen={isQRCodeModalOpen}
        setOpen={setIsQRCodeModalOpen}
      />
    </>
  );
};

export default ScanConnectionCard;
