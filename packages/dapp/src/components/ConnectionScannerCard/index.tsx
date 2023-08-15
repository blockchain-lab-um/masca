import React, { useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';
import Button from '../Button';
import ScanQRCodeModal from '../QRCodeScannerCard/ScanQRCodeModal';

export const ConnectionScannerCard = () => {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const { sessionId, key, exp } = useSessionStore((state) => ({
    sessionId: state.sessionId,
    key: state.key,
    exp: state.exp,
  }));

  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const changeRequestData = useQRCodeStore((state) => state.changeRequestData);
  const isConnectedToMasca = () => {
    if (!sessionId || !key || !exp) return false;

    // Check if expiration date is valid
    if (Date.now() > exp) return false;
    return true;
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
          title: 'Data sent',
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error sending QR code data',
          type: 'error',
          loading: false,
        });
      }, 200);
    }
  };

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

      console.log('Connection established');
      console.log('data.sessionId', data.sessionId);
      console.log('data.keyData', data.keyData);
      console.log('data.exp', data.exp);

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Connection established',
          type: 'success',
          loading: false,
        });
      }, 200);
    } catch (e) {
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
    <>
      <div className="h-min w-full p-4 pb-8">
        <div className="flex">
          <div>
            <div className="text-h3 font-ubuntu font-semibold">QR Scanner</div>

            <div className="mt-8">
              {!isConnectedToMasca() ? (
                <p>
                  Scan a connection QR code generated on Masca.io to get
                  started.
                </p>
              ) : (
                <div className="flex gap-x-2">
                  Succesfully connected to Masca!
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          {!isConnectedToMasca() ? (
            <Button
              variant="primary"
              onClick={() => setIsConnectionModalOpen(true)}
            >
              Scan Connection
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsQRCodeModalOpen(true)}
            >
              {'Scan QR code'}
            </Button>
          )}
        </div>
      </div>
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessConnectionQRCode}
        title={'Scan Connection'}
        isOpen={isConnectionModalOpen}
        setOpen={setIsConnectionModalOpen}
      />
      <ScanQRCodeModal
        onScanSuccess={onScanSuccessQRCode}
        title={'Scan QR Code'}
        isOpen={isQRCodeModalOpen}
        setOpen={setIsQRCodeModalOpen}
      />
    </>
  );
};
