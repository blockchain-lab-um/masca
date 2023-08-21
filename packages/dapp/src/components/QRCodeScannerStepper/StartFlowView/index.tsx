import React, { useState } from 'react';
import { VerifiableCredential } from '@veramo/core';

import Button from '@/components/Button';
import { useGeneralStore, useSessionStore } from '@/stores';
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
  const [flowFinished, setFlowFinished] = useState<{
    finished: boolean;
    type: string | null;
  }>({
    finished: false,
    type: null,
  });
  const { request, session } = useSessionStore((state) => ({
    request: state.request,
    session: state.session,
  }));

  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <div>
      {isConnected && session.deviceType === 'primary' && (
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
      {session.deviceType === 'secondary' && (
        <>
          <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
            Code Scanned! Proceed on primary device.
            <div className="mt-4 text-xs">
              You can Scan/Upload a new QR once primary device indicates so
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="primary" onClick={scanNewCode}>
              Scan new code
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
