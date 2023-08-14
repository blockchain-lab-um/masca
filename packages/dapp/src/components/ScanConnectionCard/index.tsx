'use client';

import { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';
import Button from '../Button';
import CreateConnectionModal from '../CreateConnectionCard/CreateConnectionModal';
import ScanQRCodeModal from './ScanQRCodeModal';

const ScanConnectionCard = () => {
  const t = useTranslations('ScanConnectionCard');
  const { sessionId, key, exp } = useSessionStore((state) => ({
    sessionId: state.sessionId,
    key: state.key,
    exp: state.exp,
  }));

  const isConnected = useGeneralStore((state) => state.isConnected);
  const changeRequestData = useQRCodeStore((state) => state.changeRequestData);

  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Same device
    if (isConnected) {
      changeRequestData(decodedText);
      return;
    }

    // Cross device (mobile <-> desktop)
    if (!sessionId || !key || !exp) return;
    setIsQRCodeModalOpen(false);

    let data: string | null = null;

    try {
      if (
        decodedText.startsWith('openid-credential-offer://') ||
        decodedText.startsWith('openid://')
      ) {
        data = decodedText;
      } else {
        // Check if the QR code contains a Polygon Credential Offer or a Polygon Authorization Request
        const jsonDecodedData = JSON.parse(decodedText);

        if (jsonDecodedData) {
          if (
            jsonDecodedData.type ===
            'https://iden3-communication.io/authorization/1.0/request'
          ) {
            data = decodedText;
          } else if (
            jsonDecodedData.type ===
            'https://iden3-communication.io/credentials/1.0/offer'
          ) {
            data = decodedText;
          }
        }
      }

      if (!data) throw new Error('Unsupported QR code');

      // Encrypt data
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encodedText = new TextEncoder().encode(data);

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
      <div className="flex flex-col justify-between p-4">
        <div>
          <div className="text-h3 font-ubuntu font-semibold">QR Scanner</div>

          <div className="mt-8">
            <p>
              1. If your device has a camera you can scan a QR code to start an
              OIDC session. You can also upload a screenshot of a QR code from
              your computer.
            </p>
            <div className="mt-4 flex">
              <p>
                {`2. If your device does not have a camera, you can create
                connection to a mobile device by generating a QR code and
                scanning it on the mobile device. You can start that process by
                clicking on the "Create Connection" button.`}
              </p>
              <div className="min-w-max items-center justify-center px-4">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Connection
                </Button>
              </div>
            </div>
            <div className="mt-4 flex">
              <p>
                3. Once connection is created, you can scan a QR code to start.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          {!isConnected && (
            <Button
              variant="primary"
              onClick={() => setIsConnectionModalOpen(true)}
            >
              {t('scan-connection')}
            </Button>
          )}
          <Button variant="primary" onClick={() => setIsQRCodeModalOpen(true)}>
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
      <CreateConnectionModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default ScanConnectionCard;
