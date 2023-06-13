'use client';

import { useState } from 'react';
import { CredentialOffer } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import qs from 'qs';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useMascaStore, useToastStore } from '@/stores';

const GetCredential = () => {
  const api = useMascaStore((state) => state.mascaApi);
  const { setTitle, setText, setLoading, setToastOpen, setType } =
    useToastStore(
      (state) => ({
        setTitle: state.setTitle,
        setText: state.setText,
        setLoading: state.setLoading,
        setToastOpen: state.setOpen,
        setType: state.setType,
      }),
      shallow
    );

  const [credentialOfferURI, setCredentialOfferURI] = useState<string | null>(
    null
  );
  const [parsedCredentialOfferURI, setParsedCredentialOfferURI] =
    useState<CredentialOffer | null>(null);

  const parseCredentialOffer = () => {
    if (!credentialOfferURI) return;

    try {
      const parsedOffer = qs.parse(credentialOfferURI.split('?')[1], {
        depth: 50,
        parameterLimit: 1000,
      }).credential_offer as unknown as CredentialOffer;

      setParsedCredentialOfferURI(parsedOffer);
    } catch (e) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Failed to parse credential offer URI');
        setLoading(false);
        setToastOpen(true);
      }, 100);
      console.log(e);
    }
  };

  const getDemoCredentialOfferRequestURI = async () => {
    const query = {
      credentials: ['GmCredential'],
      grants: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      userPinRequired: false,
    };

    try {
      const credentialOfferRequestResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_DEMO_ISSUER as string
        }/credential-offer?${qs.stringify(query, { encode: true })}`,
        {
          method: 'GET',
        }
      );

      setCredentialOfferURI(await credentialOfferRequestResponse.text());
    } catch (e) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Failed to get DEMO credential offer URI');
        setLoading(false);
        setToastOpen(true);
      }, 100);
      console.log(e);
    }
  };

  const handleCredentialOfferRequest = async () => {
    if (!api || !credentialOfferURI || !parsedCredentialOfferURI) return;

    setLoading(true);
    setType('normal');
    setTitle('Handling credential offer');
    setToastOpen(true);

    const handleCredentialOfferResponse = await api.handleOIDCCredentialOffer({
      credentialOfferURI,
    });

    if (isError(handleCredentialOfferResponse)) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while handling credential offer');
        setText(handleCredentialOfferResponse.error);

        setLoading(false);
        setToastOpen(true);
      }, 100);
      console.log(handleCredentialOfferResponse.error);
      return;
    }

    const credential = handleCredentialOfferResponse.data;

    setLoading(true);
    setType('normal');
    setTitle('Saving Credential');
    setToastOpen(true);

    // Save credential
    // TODO: Convert credential to VC first
    const saveCredentialResponse = await api.saveVC(credential, {
      store: ['snap'],
    });

    if (isError(saveCredentialResponse)) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while saving credential');
        setLoading(false);
        setToastOpen(true);
      }, 100);
      console.log(saveCredentialResponse.error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4 p-4">
      <div className="flex h-fit w-full flex-col items-baseline justify-center space-y-2 sm:flex-row sm:space-x-4">
        <Button
          variant={credentialOfferURI ? 'secondary' : 'primary'}
          onClick={getDemoCredentialOfferRequestURI}
        >
          Get Demo Credential Offer
        </Button>
        <Button
          variant={
            credentialOfferURI
              ? parsedCredentialOfferURI
                ? 'secondary'
                : 'primary'
              : 'gray'
          }
          onClick={parseCredentialOffer}
          disabled={!credentialOfferURI}
        >
          Parse Credential Offer
        </Button>
        <Button
          variant={parsedCredentialOfferURI ? 'primary' : 'gray'}
          disabled={!parsedCredentialOfferURI}
          onClick={handleCredentialOfferRequest}
        >
          Handle Credential Offer
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setCredentialOfferURI(null);
            setParsedCredentialOfferURI(null);
          }}
        >
          Reset
        </Button>
      </div>
      {!parsedCredentialOfferURI && (
        <div className="w-full pt-4">
          <InputField
            value={credentialOfferURI ?? ''}
            variant="gray"
            size="lg"
            placeholder="Credential Offer URI"
            rounded="xl"
            shadow="none"
            setValue={setCredentialOfferURI}
          />
        </div>
      )}
      {parsedCredentialOfferURI && (
        <textarea
          className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono h-full w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
          disabled
          value={JSON.stringify(parsedCredentialOfferURI, null, 4)}
        />
      )}
    </div>
  );
};

export default GetCredential;
