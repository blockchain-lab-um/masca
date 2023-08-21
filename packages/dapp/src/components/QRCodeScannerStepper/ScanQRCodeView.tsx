import React, { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { Html5Qrcode } from 'html5-qrcode';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';
import Button from '../Button';
import ScanQRCodeModal from '../ScanQRCodeModal/ScanQRCodeModal';
import UploadButton from '../UploadButton';

interface ScanQRCodeViewProps {
  onQRCodeScanned: () => void;
}

export const ScanQRCodeView = ({ onQRCodeScanned }: ScanQRCodeViewProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const session = useSessionStore((state) => state.session);

  const changeRequestData = useQRCodeStore((state) => state.changeRequestData);

  const onScanSuccessQRCode = async (decodedText: string, _: any) => {
    // Same device
    if (isConnected && session.deviceType === 'primary') {
      changeRequestData(decodedText);
      return;
    }

    // Cross device (mobile <-> desktop)
    if (!session.sessionId || !session.key || !session.exp) return;
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
      const response = await fetch(
        `/api/qr-code-session/${session.sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: uint8ArrayToHex(encryptedData),
            iv: uint8ArrayToHex(iv),
          }),
        }
      );

      if (!response.ok) throw new Error();

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Success',
          type: 'success',
          loading: false,
        });
      }, 200);
      onQRCodeScanned();
    } catch (e) {
      console.log('error', e);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error',
          type: 'error',
          loading: false,
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
          title: 'Invalid QR code',
          type: 'error',
          loading: false,
        });
      }, 200);
    }
  };

  return (
    <div>
      {session.connected && (
        <>
          {session.deviceType === 'primary' && session.hasCamera && (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                Scan or Upload a QR code to continue!
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  variant="primary"
                  onClick={() => setIsQRCodeModalOpen(true)}
                >
                  Scan QR Code
                </Button>
                <UploadButton handleUpload={handleUpload} />
              </div>
            </div>
          )}
          {session.deviceType === 'secondary' && session.hasCamera && (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>
                  Successfully{' '}
                  <span className="text-green-500">connected </span>
                  to primary device!
                </div>
                <div className="mt-2">Scan a QR code to continue!</div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => setIsQRCodeModalOpen(true)}
                >
                  Scan QR Code
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {session.connected && !session.hasCamera && (
        <>
          <div>
            <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
              <div>
                Successfully <span className="text-green-500">connected </span>
                to secondary device!
              </div>
              <div className="mt-2">
                Scan a QR code on your secondary device to continue!
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <div className="dark:border-orange-accent-dark h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-t-pink-500/0 dark:border-t-pink-500/0"></div>
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
