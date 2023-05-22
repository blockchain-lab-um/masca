import { useEffect, useState } from 'react';
import qs from 'qs';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import { useMascaStore } from '@/stores';

export default function Verify() {
  const api = useMascaStore((state) => state.mascaApi);

  const [authorizationRequestURI, setAuthorizationRequestURI] = useState('');
  const [parsedAuthorizationRequestURI, setParsedAuthorizationRequestURI] =
    useState<any>({});

  const getAuthorizationRequestURI = async () => {
    const query = {
      credentialType: 'test_presentation_definition_1',
      state: window.crypto.randomUUID(),
    };

    const authorizationRequestResponse = await fetch(
      `http://localhost:3004/authorization-request?${qs.stringify(query)}`,
      {
        method: 'GET',
      }
    );

    setAuthorizationRequestURI(await authorizationRequestResponse.text());
  };

  const handleAuthorizationRequest = async () => {
    console.log(authorizationRequestURI);

    if (!api) return;

    console.log('handleAuthorizationRequest');
  };

  useEffect(() => {
    if (!authorizationRequestURI) return;

    const parsedRequest = qs.parse(authorizationRequestURI.split('?')[1], {
      depth: 50,
      parameterLimit: 1000,
    });

    setParsedAuthorizationRequestURI(parsedRequest);
  }, [authorizationRequestURI]);

  return (
    <div className="dark:bg-navy-blue-800 flex min-h-[50vh] justify-center rounded-3xl bg-white shadow-lg">
      <ConnectedProvider>
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="flex flex-1 items-center justify-center">
            {/* Map parsed credential offer uri properties */}
            <>
              {authorizationRequestURI &&
                JSON.stringify(parsedAuthorizationRequestURI, null, 2)}
            </>
          </div>
          <div className="flex flex-row space-x-4">
            <Button variant="primary" onClick={getAuthorizationRequestURI}>
              Get Authorization Request
            </Button>
            <Button variant="secondary" onClick={handleAuthorizationRequest}>
              Handle Authorization Request
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
