import { useState } from 'react';
import qs from 'qs';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import { useMascaStore } from '@/stores';

export default function Issue() {
  const api = useMascaStore((state) => state.mascaApi);

  const [credentialOfferURI, setCredentialOfferURI] = useState('');

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
    console.log(credentialOfferURI);

    if (!api) return;

    await api.handleOIDCCredentialOffer({
      credentialOfferURI,
    });
  };

  return (
    <div className="dark:bg-navy-blue-800 flex min-h-[50vh] justify-center rounded-3xl bg-white shadow-lg">
      <ConnectedProvider>
        <h1>issue</h1>
        <Button variant="primary" onClick={getCredentialOfferRequestURI}>
          getCredentialOfferRequest
        </Button>
        <Button variant="secondary" onClick={handleCredentialOfferRequest}>
          handleCredentialOfferRequest
        </Button>
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
