'use client';

import { isError } from '@blockchain-lab-um/masca-connector';
import type { CredentialOffer } from '@blockchain-lab-um/oidc-types';
import { useTranslations } from 'next-intl';
import qs from 'qs';
import { useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useMascaStore, useToastStore } from '@/stores';

const GetCredential = () => {
  const t = useTranslations('GetCredential');
  const api = useMascaStore((state) => state.mascaApi);

  const [credentialOfferURI, setCredentialOfferURI] = useState<string | null>(
    null
  );
  const [parsedCredentialOfferURI, setParsedCredentialOfferURI] =
    useState<CredentialOffer | null>(null);

  const parseCredentialOffer = async () => {
    if (!credentialOfferURI) return;

    try {
      let parsedOffer: CredentialOffer;

      const parsedOfferURI = qs.parse(credentialOfferURI.split('?')[1], {
        depth: 50,
        parameterLimit: 1000,
      });

      if (parsedOfferURI.credential_offer_uri) {
        // Fetch credential offer from URI
        const response = await fetch(
          parsedOfferURI.credential_offer_uri as string
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        parsedOffer = await response.json();
      } else {
        parsedOffer =
          parsedOfferURI.credential_offer as unknown as CredentialOffer;
      }

      setParsedCredentialOfferURI(parsedOffer);
    } catch (e) {
      console.log(e);

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('parsing-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
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
        `${process.env
          .NEXT_PUBLIC_DEMO_ISSUER!}/credential-offer?${qs.stringify(query, {
          encode: true,
        })}`,
        {
          method: 'GET',
        }
      );

      setCredentialOfferURI(await credentialOfferRequestResponse.text());
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failed to get DEMO credential offer URI',
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      console.log(e);
    }
  };

  const handleCredentialOfferRequest = async () => {
    if (!api || !credentialOfferURI || !parsedCredentialOfferURI) return;

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
      credentialOffer: credentialOfferURI,
    });

    useToastStore.setState({
      open: false,
    });

    if (isError(handleCredentialOfferResponse)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('handling-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      console.log(handleCredentialOfferResponse.error);
      return;
    }

    const credential = handleCredentialOfferResponse.data;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('saving'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);

    console.log(credential);

    // Save credential
    // TODO: Handle multiple credentials
    const saveCredentialResponse = await api.saveCredential(credential[0], {
      store: ['snap'],
    });

    useToastStore.setState({
      open: false,
    });

    if (isError(saveCredentialResponse)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('saving-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);

      console.log(saveCredentialResponse.error);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('saving-success'),
        type: 'success',
        loading: false,
        link: null,
      });
    }, 200);
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
