'use client';

import { useEffect } from 'react';
import { hexToUint8Array } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import {
  useGeneralStore,
  useMascaStore,
  useSessionStore,
  useToastStore,
} from '@/stores';
import { useQRCodeStore } from '@/stores/qrCodeStore';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const QRCodeSessionProvider = () => {
  const t = useTranslations('QRCodeSessionProvider');

  const { request, session, changeRequest } = useSessionStore((state) => ({
    request: state.request,
    session: state.session,
    changeRequest: state.changeRequest,
    changeSession: state.changeSession,
  }));

  const requestData = useQRCodeStore((state) => state.requestData);

  const isConnected = useGeneralStore((state) => state.isConnected);
  const api = useMascaStore((state) => state.mascaApi);

  // Conditionally fetch session data
  const { data } = useSWR(
    () =>
      session.sessionId && isConnected
        ? `/api/qr-code-session/${session.sessionId}`
        : null,
    fetcher,
    {
      // Refresh every 10 seconds
      errorRetryInterval: 10000,
      errorRetryCount: 100,
      refreshInterval: 10000,
    }
  );

  useEffect(() => {
    if (!session.exp) return;

    if (session.exp && session.exp < Date.now()) {
      useSessionStore.setState({
        session: {
          sessionId: null,
          key: null,
          exp: null,
          connected: false,
          deviceType: null,
          hasCamera: false,
        },
      });
    }
  }, [session.exp]);

  const handleNewRequest = async (_data: string) => {
    if (_data === 'Created Connection') {
      useSessionStore.setState({
        session: { ...session, connected: true },
      });
      return;
    }
    if (!isConnected) return;
    if (!api) return;
    if (request.active) return;

    // OIDC Credential Offer
    if (_data.startsWith('openid-credential-offer://')) {
      changeRequest({
        active: true,
        data: _data,
        type: 'credentialOffer',
        finished: false,
      });

      return;
    }

    // OIDC Authorization Request
    if (_data.startsWith('openid://')) {
      changeRequest({
        active: true,
        data: _data,
        type: 'oidcAuth',
        finished: false,
      });
      return;
    }

    let jsonDecodedData;
    try {
      jsonDecodedData = JSON.parse(_data);
      if (!jsonDecodedData) throw new Error('Invalid JSON');

      // Polygon Credential Offer
      if (
        jsonDecodedData.type ===
        'https://iden3-communication.io/credentials/1.0/offer'
      ) {
        changeRequest({
          active: true,
          data: _data,
          type: 'polygonCredentialOffer',
          finished: false,
        });
        return;
      }

      // Polygon Authorization Request
      if (
        jsonDecodedData.type ===
        'https://iden3-communication.io/authorization/1.0/request'
      ) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'Polygon Authorization Request received',
            type: 'info',
            loading: false,
            link: `/app/qr-code-session`,
          });
        }, 200);

        changeRequest({
          active: true,
          data: _data,
          type: 'polygonAuth',
          finished: false,
        });

        return;
      }
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('unsuported'),
        type: 'error',
        loading: false,
        link: '',
      });
    }, 200);
  };

  // Decrypt received data
  useEffect(() => {
    if (!session.key || !data) return;

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
        session.key!,
        hexToUint8Array(encryptedData)
      );

      const decoded = new TextDecoder().decode(decrypted);

      return decoded;
    };

    decryptData()
      .then(async (_data) => handleNewRequest(_data))
      .catch((e) => console.log(e));
  }, [data, session.key]);

  // New request recieved (QR Code upload)
  useEffect(() => {
    if (!requestData) return;
    handleNewRequest(requestData).catch((e) => console.log(e));
  }, [requestData]);

  return <></>;
};

export default QRCodeSessionProvider;
