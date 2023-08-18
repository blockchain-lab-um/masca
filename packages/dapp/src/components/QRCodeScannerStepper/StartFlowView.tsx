import React, { useEffect, useState } from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';

import {
  useGeneralStore,
  useMascaStore,
  useSessionStore,
  useToastStore,
} from '@/stores';

interface StartFlowViewProps {
  scanNewCode: () => void;
  deviceType: string;
}

export const StartFlowView = ({
  scanNewCode,
  deviceType,
}: StartFlowViewProps) => {
  const [flowFinished, setFlowFinished] = useState<{
    finished: boolean;
    type: string | null;
  }>({
    finished: false,
    type: null,
  });
  const {
    decryptedData,
    recievedCredential,
    recievedCredentialOffer,
    polygonAuthRequest,
    oidcAuthRequest,
    authData,
    changeRecievedCredential,
    changeRecievedCredentialOffer,
    changePolygonAuthRequest,
    changeOidcAuthRequest,
    changeDecryptedData,
    changeAuthData,
  } = useSessionStore((state) => ({
    authData: state.authData,
    decryptedData: state.decryptedData,
    recievedCredential: state.recievedCredential,
    recievedCredentialOffer: state.recievedCredentialOffer,
    polygonAuthRequest: state.polygonAuthRequest,
    oidcAuthRequest: state.oidcAuthRequest,
    changeRecievedCredential: state.changeRecievedCredential,
    changeRecievedCredentialOffer: state.changeRecievedCredentialOffer,
    changePolygonAuthRequest: state.changePolygonAuthRequest,
    changeOidcAuthRequest: state.changeOidcAuthRequest,
    changeDecryptedData: state.changeDecryptedData,
    changeAuthData: state.changeAuthData,
  }));

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const isConnected = useGeneralStore((state) => state.isConnected);

  const handlePolygonAuthRequest = async () => {
    console.log('polygon auth request started', currDidMethod);
    if (
      polygonAuthRequest &&
      authData &&
      api &&
      isConnected &&
      currDidMethod === 'did:polygonid'
    ) {
      const result = await api.handleAuthorizationRequest({
        authorizationRequest: authData,
      });
      if (isError(result)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'An error ocurred while processing the request',
            type: 'error',
            loading: false,
          });
          console.log('error', result.error);
        }, 200);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Successfully processed the request',
          type: 'success',
          loading: false,
        });
      }, 200);
    }
    changeAuthData(null);
    changePolygonAuthRequest(false);
    setFlowFinished({ finished: true, type: 'polygonAuthRequest' });
  };

  useEffect(() => {
    handlePolygonAuthRequest().catch((e) => {
      console.log(e);
    });
  }, [polygonAuthRequest]);

  return (
    <>
      {isConnected && (
        <>
          {polygonAuthRequest && (
            <div>
              Handling Polygon Auth Request...
              {currDidMethod !== 'did:polygonid' && (
                <div>
                  Wrong DID Method Change DID method to polygonID & network to
                  Polygon Mainnet to start!
                </div>
              )}
            </div>
          )}
          {oidcAuthRequest && <div>OIDC Auth Request...</div>}
          {recievedCredentialOffer && <div>Credential Offer...</div>}
          {recievedCredential && <div>Credential...</div>}
          {flowFinished.finished && (
            <div>
              <div>Flow finished!</div>
              <div>Flow type: {flowFinished.type}</div>
              <button
                onClick={() => {
                  setFlowFinished({ finished: false, type: null });
                  scanNewCode();
                }}
              >
                Scan new code
              </button>
            </div>
          )}
        </>
      )}
      {!isConnected && deviceType === 'camera' && (
        <>
          <div>Code scanned. Proceed on another device.</div>
          <button onClick={scanNewCode}>Scan new code</button>
        </>
      )}
    </>
  );
};
