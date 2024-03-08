import { isError } from '@blockchain-lab-um/masca-connector';
import { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import {
  useEncryptedSessionStore,
  useMascaStore,
  useToastStore,
} from '@/stores';

interface CredentialOfferViewProps {
  onCredentialRecieved: (recievedCredential: VerifiableCredential) => void;
}

export const CredentialOfferView = ({
  onCredentialRecieved,
}: CredentialOfferViewProps) => {
  const t = useTranslations('CredentialOfferView');
  const { request, changeRequest } = useEncryptedSessionStore((state) => ({
    request: state.request,
    changeRequest: state.changeRequest,
  }));

  const api = useMascaStore((state) => state.mascaApi);
  const currDidMethod = useMascaStore((state) => state.currDIDMethod);
  const { isConnected } = useAccount();

  const handleCredentialOffer = async () => {
    if (!api) return;
    if (!isConnected) return;

    if (request.data) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('handling'),
          type: 'normal',
          loading: true,
          link: null,
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
            title: t('error'),
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
        console.log(handleCredentialOfferResponse.error);
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
      return currDidMethod === 'did:polygonid' || currDidMethod === 'did:iden3';
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
          <div className="text-h4 pb-8 font-medium">
            {request.type === 'polygonCredentialOffer'
              ? 'Polygon ID Credential Offer'
              : 'OIDC Credential Offer'}{' '}
          </div>
          {request.finished ? (
            <div>{t('finished')}</div>
          ) : (
            <div className="mt-8 flex justify-center">
              <Button variant="primary" onClick={handleCredentialOffer}>
                {t('start')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          {t('switch-to')}
          {request.type === 'polygonCredentialOffer'
            ? 'did:polygonid or did:iden3'
            : 'did:key:jwk_jcs-pub'}{' '}
          {t('to-continue')}
        </div>
      )}
    </>
  );
};
