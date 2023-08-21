import React from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { VerifiableCredential } from '@veramo/core';

import Button from '@/components/Button';
import {
  useGeneralStore,
  useMascaStore,
  useSessionStore,
  useToastStore,
} from '@/stores';

interface CredentialOfferViewProps {
  onCredentialRecieved: (recievedCredential: VerifiableCredential) => void;
}

export const CredentialOfferView = ({
  onCredentialRecieved,
}: CredentialOfferViewProps) => {
  const { request, changeRequest } = useSessionStore((state) => ({
    request: state.request,
    changeRequest: state.changeRequest,
  }));

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const isConnected = useGeneralStore((state) => state.isConnected);

  const handleCredentialOffer = async () => {
    if (!api) return;
    if (!isConnected) return;

    if (request.data) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Handling Credential Offer',
          type: 'normal',
          loading: true,
        });
      }, 200);

      const handleCredentialOfferResponse = await api.handleCredentialOffer({
        credentialOffer: request.data,
      });

      useToastStore.setState({
        open: false,
      });

      if (isError(handleCredentialOfferResponse)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'error',
            type: 'error',
            loading: false,
          });
        }, 200);
        console.log(handleCredentialOfferResponse.error);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Success',
          type: 'success',
          loading: false,
        });
      }, 200);

      // TODO: Handle multiple credentials
      onCredentialRecieved(handleCredentialOfferResponse.data[0]);
      changeRequest({
        ...request,
        finished: true,
      });
    }
  };

  const isRightMethod = () => {
    if (request.type === 'polygonCredentialOffer') {
      return currDidMethod === 'did:polygonid';
    }
    if (request.type === 'credentialOffer') {
      return currDidMethod === 'did:key:jwk_jcs-pub';
    }
    return true;
  };

  return (
    <>
      {isRightMethod() ? (
        <>
          <div className="dark:bg-navy-blue-700 rounded-xl bg-gray-100 p-4">
            Recieved Request for{' '}
            {request.type === 'polygonCredentialOffer' ? 'PolygonID' : 'OIDC'}{' '}
            Credential Offer
          </div>
          {request.finished ? (
            <div>Request Finished.</div>
          ) : (
            <div className="mt-8 flex justify-center">
              <Button variant="primary" onClick={handleCredentialOffer}>
                Start flow
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          Switch to{' '}
          {request.type === 'polygonCredentialOffer'
            ? 'did:polygonid'
            : 'did:key:jwk_jcs-pub'}{' '}
          to continue
        </div>
      )}
    </>
  );
};
