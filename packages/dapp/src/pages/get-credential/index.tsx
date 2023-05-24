import { useState } from 'react';
import type { CredentialOffer } from '@blockchain-lab-um/oidc-types';
import qs from 'qs';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import InputField from '@/components/InputField';
import { useMascaStore } from '@/stores';

export default function Issue() {
  const api = useMascaStore((state) => state.mascaApi);

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
      console.log(e);
    }
  };

  const getDemoCredentialOfferRequestURI = async () => {
    const query = {
      credentials: ['GmCredential'],
      grants: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      userPinRequired: true,
    };

    try {
      const credentialOfferRequestResponse = await fetch(
        `http://localhost:3003/credential-offer?${qs.stringify(query)}`,
        {
          method: 'GET',
        }
      );

      setCredentialOfferURI(await credentialOfferRequestResponse.text());
    } catch (e) {
      console.log(e);
    }
  };

  const handleCredentialOfferRequest = async () => {
    if (!api || !credentialOfferURI || !parsedCredentialOfferURI) return;

    await api.handleOIDCCredentialOffer({
      credentialOfferURI,
    });
  };

  return (
    <div className="flex h-full justify-center sm:h-fit">
      <div className="dark:bg-navy-blue-800 xl:max-w-[50rem]justify-center flex h-full min-h-[50vh] w-full rounded-3xl bg-white shadow-lg md:max-w-4xl lg:max-w-6xl">
        <ConnectedProvider>
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
        </ConnectedProvider>
      </div>
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
