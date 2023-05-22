/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useEffect, useState } from 'react';
import qs from 'qs';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import { useMascaStore } from '@/stores';

export default function Issue() {
  const api = useMascaStore((state) => state.mascaApi);

  const [credentialOfferURI, setCredentialOfferURI] = useState('');
  const [parsedCredentialOfferURI, setParsedCredentialOfferURI] = useState<any>(
    {}
  );

  const getCredentialOfferRequestURI = async () => {
    const query = {
      credentials: ['GmCredential'],
      grants: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      userPinRequired: true,
    };

    const credentialOfferRequestResponse = await fetch(
      `http://localhost:3003/credential-offer?${qs.stringify(query)}`,
      {
        method: 'GET',
      }
    );

    setCredentialOfferURI(await credentialOfferRequestResponse.text());
  };

  const handleCredentialOfferRequest = async () => {
    if (!api) return;

    await api.handleOIDCCredentialOffer({
      credentialOfferURI,
    });
  };

  useEffect(() => {
    if (!credentialOfferURI) return;

    const parsedOffer = qs.parse(credentialOfferURI.split('?')[1], {
      depth: 50,
      parameterLimit: 1000,
    });

    setParsedCredentialOfferURI(parsedOffer);
  }, [credentialOfferURI]);

  return (
    <div className="dark:bg-navy-blue-800 flex min-h-[50vh] justify-center rounded-3xl bg-white shadow-lg">
      <ConnectedProvider>
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="flex-1">
            <>
              {parsedCredentialOfferURI &&
                // Map trought keys and show keys and values
                Object.keys(parsedCredentialOfferURI).map((key) => (
                  <div key={key} className="flex flex-row">
                    <div className="font-bold">{key}:</div>
                    <div className="ml-2">
                      {JSON.stringify(parsedCredentialOfferURI[key])}
                    </div>
                  </div>
                ))}
            </>
          </div>
          <div className="flex flex-row space-x-4">
            <Button variant="primary" onClick={getCredentialOfferRequestURI}>
              Get Credential Offer
            </Button>
            <Button variant="secondary" onClick={handleCredentialOfferRequest}>
              Handle Credential Offer
            </Button>
          </div>
        </div>
      </ConnectedProvider>
    </div>
  );
}

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
