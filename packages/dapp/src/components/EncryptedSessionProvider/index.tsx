'use client';

import { useEffect, useMemo } from 'react';
import { hexToUint8Array } from '@blockchain-lab-um/masca-connector';
import { createClient as createSupbaseClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';

import { Database } from '@/utils/supabase/database.types';
import { useMascaStore, useToastStore } from '@/stores';
import { useEncryptedSessionStore } from '@/stores/encryptedSessionStore';

export const EncryptedSessionProvider = () => {
  const t = useTranslations('EncryptedSessionProvider');

  const {
    channelId,
    session,
    request,
    deviceType,
    changeConnected,
    changeRequest,
    changeSession,
  } = useEncryptedSessionStore((state) => ({
    channelId: state.channelId,
    session: state.session,
    request: state.request,
    deviceType: state.deviceType,
    changeConnected: state.changeConnected,
    changeRequest: state.changeRequest,
    changeSession: state.changeSession,
  }));
  const api = useMascaStore((state) => state.mascaApi);

  const client = useMemo(
    () =>
      createSupbaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // Decrypt data
  const decryptData = async ({
    iv,
    encryptedData,
  }: {
    iv: Uint8Array;
    encryptedData: string;
  }) => {
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

  const handleRequest = async (data: string) => {
    if (!api) return;
    if (request.active) return;

    // OIDC Credential Offer
    if (data.startsWith('openid-credential-offer://')) {
      changeRequest({
        active: true,
        data,
        type: 'credentialOffer',
        finished: false,
      });

      return;
    }

    // OIDC Authorization Request
    if (data.startsWith('openid://')) {
      changeRequest({
        active: true,
        data,
        type: 'oidcAuth',
        finished: false,
      });
      return;
    }

    let jsonDecodedData;
    try {
      jsonDecodedData = JSON.parse(data);
      if (!jsonDecodedData) throw new Error('Invalid JSON');

      // Polygon Credential Offer
      if (
        jsonDecodedData.type ===
        'https://iden3-communication.io/credentials/1.0/offer'
      ) {
        changeRequest({
          active: true,
          data,
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
          data,
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
        link: null,
      });
    }, 200);
  };

  useEffect(() => {
    if (channelId && deviceType === 'primary') {
      client
        .channel(channelId)
        .on('broadcast', { event: 'data-scan' }, (message) => {
          console.log(message);

          // Data to uint8array
          // const iv = hexToUint8Array(encodedIV);
          // const { data: encryptedData, iv: encodedIV } = message.;

          // handleRequest(message.event).catch((e) => console.log(e));
        })
        .on('presence', { event: 'join' }, () => changeConnected(true))
        .on('presence', { event: 'leave' }, () => changeConnected(false))
        .subscribe();
    }

    return () => {
      if (channelId) {
        client
          .channel(channelId)
          .unsubscribe()
          .catch((e) => console.log(e));
      }
    };
  }, [channelId]);

  useEffect(() => {
    if (!session.exp) return;

    if (session.exp && session.exp < Date.now()) {
      changeSession({
        key: null,
        exp: null,
      });
    }
  }, [session.exp]);

  return null;
};
