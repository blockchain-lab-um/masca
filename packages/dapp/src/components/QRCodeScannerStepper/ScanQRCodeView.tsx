import React, { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';
import Button from '../Button';
import ScanQRCodeModal from '../QRCodeScannerCard/ScanQRCodeModal';

interface ScanQRCodeViewProps {
  deviceType: string;
}

export const ScanQRCodeView = ({ deviceType }: ScanQRCodeViewProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const { sessionId, key, exp, secondaryDeviceConnected } = useSessionStore(
    (state) => ({
      sessionId: state.sessionId,
      key: state.key,
      exp: state.exp,
      secondaryDeviceConnected: state.connected,
    })
  );
  const changeRequestData = useQRCodeStore((state) => state.changeRequestData);

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
          title: 'Success',
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (e) {
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

  return (
    <>
      {deviceType === 'camera' && (
        <>
          {isConnected && (
            <div>
              <div>Scan or Upload a QR code to continue!</div>
              <Button
                variant="primary"
                onClick={() => setIsQRCodeModalOpen(true)}
              >
                Scan QR Code
              </Button>
            </div>
          )}
          {secondaryDeviceConnected && (
            <div>
              <div>
                Successfully connected to primary device! <br /> Scan or Upload
                a QR code to continue!
              </div>
              <Button
                variant="primary"
                onClick={() => setIsQRCodeModalOpen(true)}
              >
                Scan QR Code
              </Button>
            </div>
          )}
        </>
      )}
      {deviceType === 'no-camera' && (
        <>
          {secondaryDeviceConnected && (
            <div>
              <div>
                Secondary device Successfully connected! Scan a QR code to
                continue...
              </div>
              <div>Spinner..</div>
            </div>
          )}
        </>
      )}
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessQRCode}
        title={'Scan QR Code'}
        isOpen={isQRCodeModalOpen}
        setOpen={setIsQRCodeModalOpen}
      />
    </>
  );
};
