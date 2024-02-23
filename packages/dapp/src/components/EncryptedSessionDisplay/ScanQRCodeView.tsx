import React, { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { createClient as createSupbaseClient } from '@supabase/supabase-js';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import ScanQRCodeModal from '@/components/ScanQRCodeModal/ScanQRCodeModal';
import UploadButton from '@/components/UploadButton';
import { useToastStore } from '@/stores';
import { useEncryptedSessionStore } from '@/stores/encryptedSessionStore';
import { useQRCodeStore } from '@/stores/qrCodeStore';

interface ScanQRCodeViewProps {
  onQRCodeScanned: () => void;
}

export const ScanQRCodeView = ({ onQRCodeScanned }: ScanQRCodeViewProps) => {
  const t = useTranslations('ScanQRCodeView');
  const { isConnected } = useAccount();
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const { channelId, session, deviceType, hasCamera, isSessionConnect } =
    useEncryptedSessionStore((state) => ({
      channelId: state.channelId,
      session: state.session,
      deviceType: state.deviceType,
      hasCamera: state.hasCamera,
      isSessionConnect: state.connected,
    }));

  const changeRequestData = useQRCodeStore((state) => state.changeRequestData);

  const onScanSuccessQRCode = async (decodedText: string, _: any) => {
    // Same device
    if (isConnected && deviceType === 'primary') {
      changeRequestData(decodedText);
      return;
    }

    // Cross device (mobile <-> desktop)
    if (!channelId || !session.key || !session.exp) return;
    if (isQRCodeModalOpen) {
      console.log('Closing QR Scan modal...');
      setIsQRCodeModalOpen(false);
    }
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
          session.key,
          encodedText
        )
      );

      // Send data
      const client = createSupbaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      );

      client
        .channel(channelId)
        .send({
          type: 'broadcast',
          event: 'scan-data',
          payload: {
            data: uint8ArrayToHex(encryptedData),
            iv: uint8ArrayToHex(iv),
          },
        })
        .catch((e) => console.error(e));

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      onQRCodeScanned();
    } catch (e) {
      console.log('error', e);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const scanner = new Html5Qrcode('reader', {
        verbose: false,
      });

      if (!scanner) throw new Error("Scanner isn't initialized");

      const decodedText = await scanner.scanFile(file, false);
      await onScanSuccessQRCode(decodedText, null);
    } catch (error) {
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
    <div>
      {isSessionConnect && (
        <>
          {deviceType === 'primary' && hasCamera && (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                {t('scan-upload')}
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsQRCodeModalOpen(true)}
                >
                  {t('scan')}
                </Button>
                <UploadButton handleUpload={handleUpload} />
              </div>
            </div>
          )}
          {deviceType === 'secondary' && hasCamera && (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>
                  {t('successfully')}
                  <span className="text-green-500">{t('connected')}</span>
                  {t('to-primary')}
                </div>
                <div className="mt-2">{t('scan-to-continue')}</div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsQRCodeModalOpen(true)}
                >
                  {t('scan')}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {isSessionConnect && !hasCamera && (
        <>
          <div>
            <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
              <div>
                {t('successfully')}{' '}
                <span className="text-green-500">{t('connected')} </span>
                {t('to-secondary')}
              </div>
              <div className="mt-2">{t('scan-to-continue-secondary')}</div>
            </div>
            <div className="text-h3 mt-16 flex items-center justify-center">
              {t('waiting')}
            </div>
          </div>
        </>
      )}
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessQRCode}
        title={'Scan QR Code'}
        isOpen={isQRCodeModalOpen}
        setOpen={setIsQRCodeModalOpen}
      />
    </div>
  );
};
