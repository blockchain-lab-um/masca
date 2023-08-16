import React, { useEffect, useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import Button from '../Button';
import CreateConnectionModal from '../CreateConnectionCard/CreateConnectionModal';
import ScanQRCodeModal from '../QRCodeScannerCard/ScanQRCodeModal';

interface ConnectDeviceViewProps {
  deviceType: string;
}

export const ConnectDeviceView = ({ deviceType }: ConnectDeviceViewProps) => {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const secondaryDeviceConnected = useSessionStore((state) => state.connected);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  useEffect(() => {
    if (secondaryDeviceConnected) setIsModalOpen(false);
  }, [secondaryDeviceConnected]);

  const onScanSuccessConnectionQRCode = async (decodedText: string, _: any) => {
    setIsConnectionModalOpen(false);
    if (secondaryDeviceConnected) return;

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
      console.log('Sending session confirmation');
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
      {deviceType === 'no-camera' && (
        <>
          {isConnected && (
            <>
              <div>
                1. To connect to a secondary mobile device, open this page on
                said device and click on ‘This device is capable of scanning QR
                codes’ button.
                <br />
                2. Scan the QR code below to create a connection
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={() => setIsModalOpen(true)}
              >
                Create Connection
              </Button>
            </>
          )}
          {!isConnected && <div>Connect Wallet to proceed</div>}
        </>
      )}
      {deviceType === 'camera' && (
        <>
          {isConnected && <div>Primary device scan skip this step</div>}
          {!isConnected && (
            <>
              <div>
                This page should only be open on a secondary device that
                supports scanning QR codes.
                <br />
                If your primary device where you want to scan/upload QR code,
                please connect your wallet!
              </div>
              <Button
                variant="primary"
                onClick={() => setIsConnectionModalOpen(true)}
              >
                Scan Connection
              </Button>
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
    </>
  );
};
