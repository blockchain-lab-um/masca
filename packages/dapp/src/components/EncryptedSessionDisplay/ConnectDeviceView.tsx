import { createClient as createSupbaseClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import CreateConnectionModal from '@/components/ConnectionModal/CreateConnectionModal';
import ScanQRCodeModal from '@/components/ScanQRCodeModal/ScanQRCodeModal';
import { useEncryptedSessionStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { Database } from '@/utils/supabase/database.types';

export const ConnectDeviceView = () => {
  const t = useTranslations('ConnectDeviceView');

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  // Global state
  const { isSignedIn, changeIsSignInModalOpen } = useAuthStore((state) => ({
    isSignedIn: state.isSignedIn,
    changeIsSignInModalOpen: state.changeIsSignInModalOpen,
  }));

  const { isConnected } = useAccount();
  const {
    connected,
    deviceType,
    hasCamera,
    changeSession,
    changeConnected,
    changeSessionId,
  } = useEncryptedSessionStore((state) => ({
    session: state.session,
    connected: state.connected,
    deviceType: state.deviceType,
    hasCamera: state.hasCamera,
    changeSession: state.changeSession,
    changeConnected: state.changeConnected,
    changeSessionId: state.changeSessionId,
  }));

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

      // Send data
      const client = createSupbaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await client
        .from('encrypted_sessions')
        .update({
          connected: true,
        })
        .eq('id', data.sessionId);

      if (error) throw new Error('Failed to send data');

      changeSession({
        key: decryptionKey,
        exp: data.exp,
      });
      changeConnected(true);
      changeSessionId(data.sessionId);

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
      console.log(e);
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
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!isSignedIn) {
                      changeIsSignInModalOpen(true);
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                >
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
                    changeSessionId(null);
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
