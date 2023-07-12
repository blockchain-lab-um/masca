'use client';

import { useEffect, useState } from 'react';
import { hexToUint8Array } from '@blockchain-lab-um/utils';
import { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { shallow } from 'zustand/shallow';

import CredentialModal from '@/components/CredentialModal';
import CredentialOfferModal from '@/components/CredentialOfferModal';
import { useGeneralStore, useSessionStore, useToastStore } from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const QRCodeSessionProvider = () => {
  const t = useTranslations('QRCodeSessionProvider');
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [recievedCredential, setRecievedCredential] =
    useState<VerifiableCredential | null>(null);

  const [isCredentialOfferModalOpen, setIsCredentialOfferModalOpen] =
    useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);

  const { sessionId, key, exp } = useSessionStore(
    (state) => ({
      sessionId: state.sessionId,
      key: state.key,
      exp: state.exp,
    }),
    shallow
  );

  const requestData = useQRCodeStore((state) => state.requestData);

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

  const handleNewRequest = async (_data: string) => {
    if (!isConnected) return;
    if (
      !_data.startsWith('openid-credential-offer://') &&
      !_data.startsWith('openid://')
    ) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('unsuported'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setDecryptedData(_data);
  };

  // Decrypt received data
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
      .then((_data) => handleNewRequest(_data))
      .catch((e) => console.log(e));
  }, [data, key]);

  // Open modal when decrypted data is available
  useEffect(() => {
    if (!decryptedData) return;
    setIsCredentialOfferModalOpen(true);
  }, [decryptedData]);

  // Reset decrypted data when modal is closed
  useEffect(() => {
    if (!isCredentialOfferModalOpen) setDecryptedData(null);
  }, [isCredentialOfferModalOpen]);

  // Open credential modal when credential is received
  useEffect(() => {
    if (!recievedCredential) return;
    setIsCredentialModalOpen(true);
  }, [recievedCredential]);

  // New request recieved (QR Code upload)
  useEffect(() => {
    if (!requestData) return;
    handleNewRequest(requestData).catch((e) => console.log(e));
  }, [requestData]);

  return (
    <>
      {recievedCredential && (
        <CredentialModal
          isOpen={isCredentialModalOpen}
          setOpen={setIsCredentialModalOpen}
          credential={recievedCredential}
        />
      )}
      {decryptedData && (
        <CredentialOfferModal
          credentialOffer={decryptedData}
          isOpen={isCredentialOfferModalOpen}
          setOpen={setIsCredentialOfferModalOpen}
          setRecievedCredential={setRecievedCredential}
        />
      )}
    </>
  );
};

export default QRCodeSessionProvider;
