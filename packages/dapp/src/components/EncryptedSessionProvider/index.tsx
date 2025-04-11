'use client';

import { hexToUint8Array } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';

import {
  useMascaStore,
  useToastStore,
  useAuthStore,
  useEncryptedSessionStore,
} from '@/stores';
import { supabaseClient } from '@/utils/supabase/supabaseClient';

export const EncryptedSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations('EncryptedSessionProvider');
  const token = useAuthStore((state) => state.token);

  const { address } = useAccount();

  const {
    sessionId,
    session,
    request,
    deviceType,
    changeConnected,
    changeRequest,
    changeSession,
  } = useEncryptedSessionStore((state) => ({
    sessionId: state.sessionId,
    session: state.session,
    request: state.request,
    deviceType: state.deviceType,
    changeConnected: state.changeConnected,
    changeRequest: state.changeRequest,
    changeSession: state.changeSession,
  }));

  const api = useMascaStore((state) => state.mascaApi);

  const client = supabaseClient(token);

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
    if (data.startsWith('openid://') || data.startsWith('openid4vp://')) {
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
    if (sessionId && deviceType === 'primary') {
      client
        .channel('realtime sessions')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'sessions' },
          async () => {
            const { data, error } = await client
              .from('sessions')
              .select()
              .eq('id', sessionId)
              .single();

            if (error || !data) {
              useToastStore.setState({
                open: true,
                title: t('fetch-failed'),
                type: 'error',
                loading: false,
                link: null,
              });

              return;
            }

            if (data.connected) {
              changeConnected(true);
            }

            if (!data.data || !data.iv) return;

            const decryptedData = await decryptData({
              iv: hexToUint8Array(data.iv),
              encryptedData: data.data,
            });

            await handleRequest(decryptedData);
          }
        )
        .subscribe();
    }
  }, [sessionId]);

  useEffect(() => {
    if (!session.exp) return;

    if (session.exp && session.exp < Date.now()) {
      changeSession({
        key: null,
        exp: null,
      });
    }
  }, [session.exp]);

  useEffect(() => {
    changeConnected(false);
    changeSession({
      exp: null,
      key: null,
    });
  }, [address]);

  return children;
};
