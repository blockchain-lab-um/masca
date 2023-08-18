import React, { useEffect, useState } from 'react';
import { uint8ArrayToHex } from '@blockchain-lab-um/masca-connector';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import Button from '../Button';
import CreateConnectionModal from '../CreateConnectionCard/CreateConnectionModal';
import ScanQRCodeModal from '../ScanQRCodeModal/ScanQRCodeModal';

export const ConnectDeviceView = () => {
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
      console.log('Closing modal');
      setIsModalOpen(false);
    }
  }, [session.connected]);

  const onScanSuccessConnectionQRCode = async (decodedText: string, _: any) => {
    console.log('Calling this....', session.connected, isConnectionModalOpen);
    if (isConnectionModalOpen) {
      console.log('Closing QR Connection modal...');
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
    <div className="">
      {session.deviceType === 'primary' && !session.hasCamera && (
        <>
          {isConnected && (
            <>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>
                  To Start Scanning QR codes, first connect your secondary
                  device
                </div>
                <div className="mt-2">
                  {`Press the 'Create Connection' button below and Scan the QR
                  code on your secondary device`}
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Create Connection
                </Button>
              </div>
            </>
          )}
          {!isConnected && <div>Connect Wallet to proceed</div>}
        </>
      )}
      {session.hasCamera && (
        <>
          {session.deviceType === 'secondary' && (
            <>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                <div>
                  Scan the Connection QR code to connect to your primary device
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    console.log('Opening connection modal');
                    setIsConnectionModalOpen(true);
                  }}
                >
                  Scan Connection
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
