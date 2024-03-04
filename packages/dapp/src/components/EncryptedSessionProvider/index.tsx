'use client';

import { useEffect, useState } from 'react';
import { hexToUint8Array } from '@blockchain-lab-um/masca-connector';
import { SupabaseClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

import { createClient } from '@/utils/supabase/client';
import { Database } from '@/utils/supabase/database.types';
import { useMascaStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { useEncryptedSessionStore } from '@/stores/encryptedSessionStore';

export const EncryptedSessionProvider = () => {
  const t = useTranslations('EncryptedSessionProvider');
  const token = useAuthStore((state) => state.token);
  const [client, setClient] = useState<null | SupabaseClient<Database>>(null);

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
    if (!client) return;
    if (sessionId && deviceType === 'primary') {
      client
        .channel('realtime encrypted_sessions')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'encrypted_sessions' },
          async () => {
            const { data, error } = await client
              .from('encrypted_sessions')
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

  useEffect(() => {
    if (!token) return;
    setClient(createClient(token));
  }, [token]);

  return null;
};
