import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import {
  useEncryptedSessionStore,
  useMascaStore,
  useToastStore,
} from '@/stores';

interface OIDCAuthViewProps {
  scanNewCode: () => void;
}

export const OIDCAuthView = ({ scanNewCode }: OIDCAuthViewProps) => {
  const t = useTranslations('OIDCAuthView');
  const { request, changeRequest } = useEncryptedSessionStore((state) => ({
    request: state.request,
    changeRequest: state.changeRequest,
  }));

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const { isConnected } = useAccount();

  const handleOIDCAuthRequest = async () => {
    if (
      api &&
      isConnected &&
      request.data &&
      (currDidMethod === 'did:key:jwk_jcs-pub' ||
        currDidMethod === 'did:key' ||
        currDidMethod === 'did:jwk')
    ) {
      const result = await api.handleAuthorizationRequest({
        authorizationRequest: request.data.startsWith('openid4vp://')
          ? request.data.replace('openid4vp://', 'openid://')
          : request.data,
      });
      if (isError(result)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('error'),
            type: 'error',
            loading: false,
            link: null,
          });
          console.log('error', result.error);
        }, 200);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    }
    changeRequest({
      ...request,
      finished: true,
    });
  };

  const isRightMethod = () =>
    currDidMethod === 'did:key:jwk_jcs-pub' ||
    currDidMethod === 'did:key' ||
    currDidMethod === 'did:jwk';

  const onScanNewCode = () => {
    changeRequest({
      active: false,
      data: null,
      type: null,
      finished: false,
    });
    scanNewCode();
  };

  return (
    <>
      <div className="text-h4 pb-8 font-medium">{t('title')}</div>
      {isRightMethod() ? (
        <div>
          {request.finished ? (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                {t('finished')}
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="primary" onClick={onScanNewCode}>
                  {t('new-scan')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <Button variant="primary" onClick={handleOIDCAuthRequest}>
                {t('start')}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
          {t('switch-to')}
        </div>
      )}
    </>
  );
};
