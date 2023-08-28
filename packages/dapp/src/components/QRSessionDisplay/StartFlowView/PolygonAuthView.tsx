import React from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import {
  useGeneralStore,
  useMascaStore,
  useSessionStore,
  useToastStore,
} from '@/stores';

interface StartFlowViewProps {
  scanNewCode: () => void;
}

export const PolygonAuthView = ({ scanNewCode }: StartFlowViewProps) => {
  const t = useTranslations('PolygonAuthView');
  const { request, changeRequest } = useSessionStore((state) => ({
    request: state.request,
    session: state.session,
    changeRequest: state.changeRequest,
    changeSession: state.changeSession,
  }));

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const isConnected = useGeneralStore((state) => state.isConnected);

  const handlePolygonAuthRequest = async () => {
    if (
      api &&
      isConnected &&
      request.data &&
      (currDidMethod === 'did:polygonid' || currDidMethod === 'did:iden3')
    ) {
      const result = await api.handleAuthorizationRequest({
        authorizationRequest: request.data,
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
    currDidMethod === 'did:polygonid' || currDidMethod === 'did:iden3';

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
              <Button variant="primary" onClick={handlePolygonAuthRequest}>
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
