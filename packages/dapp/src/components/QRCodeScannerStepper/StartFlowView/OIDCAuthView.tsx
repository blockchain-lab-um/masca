import React, { useState } from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';

import Button from '@/components/Button';
import {
  useGeneralStore,
  useMascaStore,
  useSessionStore,
  useToastStore,
} from '@/stores';

interface OIDCAuthViewProps {
  scanNewCode: () => void;
}

export const OIDCAuthView = ({ scanNewCode }: OIDCAuthViewProps) => {
  const { request, session, changeRequest, changeSession } = useSessionStore(
    (state) => ({
      request: state.request,
      session: state.session,
      changeRequest: state.changeRequest,
      changeSession: state.changeSession,
    })
  );

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const isConnected = useGeneralStore((state) => state.isConnected);

  const [progress, setProgress] = useState(false);

  const handleOIDCAuthRequest = async () => {
    console.log('polygon auth request started', currDidMethod);
    if (
      api &&
      isConnected &&
      request.data &&
      currDidMethod === 'did:polygonid'
    ) {
      setProgress(true);
      const result = await api.handleAuthorizationRequest({
        authorizationRequest: request.data,
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
        setProgress(false);
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
    changeRequest({
      ...request,
      finished: true,
    });
    setProgress(false);
  };

  const isRightMethod = () => currDidMethod === 'did:key:jwk_jcs-pub';

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
      {isRightMethod() ? (
        <div>
          {request.finished ? (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                Authorization Request completed!
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="primary" onClick={onScanNewCode}>
                  Scan another QR code
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
                Recieved an OIDC Authorization Request!
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="primary" onClick={handleOIDCAuthRequest}>
                  Start flow
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
          Switch to did:key (EBSI) to continue!
        </div>
      )}
    </>
  );
};
