import { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import { useEncryptedSessionStore } from '@/stores';
import { CredentialOfferView } from './CredentialOfferView';
import { OIDCAuthView } from './OIDCAuthView';
import { PolygonAuthView } from './PolygonAuthView';

interface StartFlowViewProps {
  scanNewCode: () => void;
  onCredentialRecieved: (recievedCredential: VerifiableCredential) => void;
}

export const StartFlowView = ({
  scanNewCode,
  onCredentialRecieved,
}: StartFlowViewProps) => {
  const t = useTranslations('StartFlowView');
  const { request, deviceType } = useEncryptedSessionStore((state) => ({
    request: state.request,
    deviceType: state.deviceType,
  }));

  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected && deviceType === 'primary' && (
        <>
          {request.type === 'polygonAuth' && (
            <PolygonAuthView scanNewCode={scanNewCode} />
          )}
          {request.type === 'oidcAuth' && (
            <OIDCAuthView scanNewCode={scanNewCode} />
          )}
          {(request.type === 'credentialOffer' ||
            request.type === 'polygonCredentialOffer') && (
            <CredentialOfferView onCredentialRecieved={onCredentialRecieved} />
          )}
        </>
      )}
      {deviceType === 'secondary' && (
        <>
          <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
            {t('scanned')}
            <div className="mt-4 text-xs">{t('scanned-desc')}</div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="primary" onClick={scanNewCode}>
              {t('new-scan')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
