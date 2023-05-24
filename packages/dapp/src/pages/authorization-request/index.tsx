import { useState } from 'react';
import type { AuthorizationRequest } from '@blockchain-lab-um/oidc-types';
import qs from 'qs';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import InputField from '@/components/InputField';
import { useMascaStore } from '@/stores';

export default function Verify() {
  const api = useMascaStore((state) => state.mascaApi);

  const [authorizationRequestURI, setAuthorizationRequestURI] = useState<
    string | null
  >(null);
  const [parsedAuthorizationRequestURI, setParsedAuthorizationRequestURI] =
    useState<AuthorizationRequest | null>(null);

  const parseAuthorizationRequest = () => {
    if (!authorizationRequestURI) return;

    try {
      const parsedRequest = qs.parse(authorizationRequestURI.split('?')[1], {
        depth: 50,
        parameterLimit: 1000,
      }) as unknown as AuthorizationRequest;

      setParsedAuthorizationRequestURI(parsedRequest);
    } catch (e) {
      console.log(e);
    }
  };

  const getDemoAuthorizationRequestURI = async () => {
    const query = {
      credentialType: 'test_presentation_definition_1',
      state: window.crypto.randomUUID(),
    };

    try {
      const authorizationRequestResponse = await fetch(
        `http://localhost:3004/authorization-request?${qs.stringify(query)}`,
        {
          method: 'GET',
        }
      );
      setAuthorizationRequestURI(await authorizationRequestResponse.text());
    } catch (e) {
      console.log(e);
    }
  };

  const handleAuthorizationRequest = async () => {
    if (!api || !authorizationRequestURI || !parsedAuthorizationRequestURI) {
      return;
    }

    console.log('handleAuthorizationRequest', authorizationRequestURI);
  };

  return (
    <div className="flex h-full justify-center sm:h-fit">
      <div className="dark:bg-navy-blue-800 xl:max-w-[50rem]justify-center flex h-full min-h-[50vh] w-full rounded-3xl bg-white shadow-lg md:max-w-4xl lg:max-w-6xl">
        <ConnectedProvider>
          <div className="flex w-full flex-col items-center space-y-4 p-4">
            <div className="flex h-fit w-full flex-col items-baseline justify-center space-y-2 sm:flex-row sm:space-x-4">
              <Button
                variant={authorizationRequestURI ? 'secondary' : 'primary'}
                onClick={getDemoAuthorizationRequestURI}
              >
                Get Demo Authorization Request
              </Button>
              <Button
                variant={
                  authorizationRequestURI
                    ? parsedAuthorizationRequestURI
                      ? 'secondary'
                      : 'primary'
                    : 'gray'
                }
                onClick={parseAuthorizationRequest}
                disabled={!authorizationRequestURI}
              >
                Parse Authorization Request
              </Button>
              <Button
                variant={parsedAuthorizationRequestURI ? 'primary' : 'gray'}
                disabled={!parsedAuthorizationRequestURI}
                onClick={handleAuthorizationRequest}
              >
                Handle Authorization Request
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setAuthorizationRequestURI(null);
                  setParsedAuthorizationRequestURI(null);
                }}
              >
                Reset
              </Button>
            </div>
            {!parsedAuthorizationRequestURI && (
              <div className="w-full pt-4">
                <InputField
                  value={authorizationRequestURI ?? ''}
                  variant="gray"
                  size="lg"
                  placeholder="Credential Offer URI"
                  rounded="xl"
                  shadow="none"
                  setValue={setAuthorizationRequestURI}
                />
              </div>
            )}
            {parsedAuthorizationRequestURI && (
              <textarea
                className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono h-full w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
                disabled
                value={JSON.stringify(parsedAuthorizationRequestURI, null, 4)}
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
