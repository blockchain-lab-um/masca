'use client';

import { useEffect, useState } from 'react';
import { hexToUint8Array } from '@blockchain-lab-um/utils';
import useSWR from 'swr';
import { shallow } from 'zustand/shallow';

import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import CredentialOfferModal from '../CredentialOfferModal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const QRCodeSessionProvider = () => {
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [isCredentialOfferModalOpen, setIsCredentialOfferModalOpen] =
    useState(false);

  const { sessionId, key, exp } = useSessionStore(
    (state) => ({
      sessionId: state.sessionId,
      key: state.key,
      exp: state.exp,
    }),
    shallow
  );

  const isConnected = useGeneralStore((state) => state.isConnected);

  // Conditionally fetch session data
  const { data } = useSWR(
    () =>
      sessionId && isConnected ? `/api/qr-code-session/${sessionId}` : null,
    fetcher,
    {
      // Refresh every 10 seconds
      errorRetryInterval: 10000,
      errorRetryCount: 100,
      refreshInterval: 10000,
    }
  );

  useEffect(() => {
    if (!exp) return;

    if (exp && exp < Date.now()) {
      useSessionStore.setState({ sessionId: null, key: null, exp: null });
    }
  }, [exp]);

  useEffect(() => {
    if (!key || !data) return;

    const { data: encryptedData, iv: encodedIV } = data;

    if (data.error_descrition || !encryptedData || !encodedIV) return;

    // Data to uint8array
    const iv = hexToUint8Array(encodedIV);

    // Decrypt data
    const decryptData = async () => {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        hexToUint8Array(encryptedData)
      );

      const decoded = new TextDecoder().decode(decrypted);

      return decoded;
    };

    decryptData()
      .then((_data) => {
        if (
          !_data.startsWith('openid-credential-offer://') &&
          !_data.startsWith('openid://')
        ) {
          setTimeout(() => {
            useToastStore.setState({
              open: true,
              title: 'Unsuported QR code data received',
              type: 'error',
              loading: false,
            });
          }, 200);
          return;
        }

        setDecryptedData(_data);
      })
      .catch((e) => console.log(e));
  }, [data, key]);

  useEffect(() => {
    setIsCredentialOfferModalOpen(!!decryptedData);
  }, [decryptedData]);

  useEffect(() => {
    if (!isCredentialOfferModalOpen) {
      setDecryptedData(null);
    }
  }, [isCredentialOfferModalOpen]);

  if (!decryptedData) {
    return null;
  }

  return (
    <CredentialOfferModal
      credentialOffer={decryptedData}
      open={isCredentialOfferModalOpen}
      setOpen={setIsCredentialOfferModalOpen}
    />
  );
};

export default QRCodeSessionProvider;
