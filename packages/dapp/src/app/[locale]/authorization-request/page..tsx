'use client';

import { useEffect, useState } from 'react';
import type { AuthorizationRequest } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import { VerifiableCredential } from '@veramo/core';
import qs from 'qs';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import InputField from '@/components/InputField';
import SelectCredentialsModal from '@/components/SelectCredentialsModal';
import { useMascaStore, useToastStore } from '@/stores';

export default function Page() {
  const api = useMascaStore((state) => state.mascaApi);

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [selectedCredentials, setSelectedCredentials] = useState<
    VerifiableCredential[]
  >([]);
  const [authorizationRequestURI, setAuthorizationRequestURI] = useState<
    string | null
  >(null);
  const [parsedAuthorizationRequestURI, setParsedAuthorizationRequestURI] =
    useState<AuthorizationRequest | null>(null);

  const [authorizationResponseError, setAuthorizationResponseError] = useState<
    string | null
  >(null);

  const [isAuthorizationResponseValid, setIsAuthorizationResponseValid] =
    useState<boolean | null>(null);

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
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while parsing authorization request');
        setLoading(false);
        setToastOpen(true);
      }, 100);
    }
  };

  const getDemoAuthorizationRequestURI = async () => {
    const query = {
      credentialType: 'test_presentation_definition_1',
      state: window.crypto.randomUUID(),
    };

    try {
      const authorizationRequestResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_DEMO_VERIFIER as string
        }/authorization-request?${qs.stringify(query)}`,
        {
          method: 'GET',
        }
      );
      setAuthorizationRequestURI(await authorizationRequestResponse.text());
    } catch (e) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while getting Demo Authorization Request');
        setLoading(false);
        setToastOpen(true);
      }, 100);

      console.log(e);
    }
  };

  const handleAuthorizationRequest = async () => {
    if (!api || !authorizationRequestURI || !parsedAuthorizationRequestURI) {
      return;
    }

    const handleAuthorizationRequestResponse =
      await api.handleOIDCAuthorizationRequest({
        authorizationRequestURI,
      });

    if (isError(handleAuthorizationRequestResponse)) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while handling authorization request');
        setText(handleAuthorizationRequestResponse.error);
        setLoading(false);
        setToastOpen(true);
      }, 100);

      return;
    }

    setCredentials(handleAuthorizationRequestResponse.data);
  };

  const sendAuthorizationResponse = async () => {
    if (!api || !authorizationRequestURI || !parsedAuthorizationRequestURI) {
      return;
    }

    const sendOIDCAuthorizationResponseResponse =
      await api.sendOIDCAuthorizationResponse({
        authorizationRequestURI,
        credentials: selectedCredentials,
      });

    if (isError(sendOIDCAuthorizationResponseResponse)) {
      setToastOpen(false);
      setType('error');
      setTimeout(() => {
        setTitle('Error while sending authorization response');
        setLoading(false);
        setToastOpen(true);
      }, 100);

      setAuthorizationResponseError(
        sendOIDCAuthorizationResponseResponse.error
      );

      setIsAuthorizationResponseValid(false);

      return;
    }

    const result = sendOIDCAuthorizationResponseResponse.data;

    setIsAuthorizationResponseValid(result);

    // Show result in toast
    setToastOpen(false);
    setType(result ? 'success' : 'error');
    setTimeout(() => {
      setTitle(`Authorization response is: ${result ? 'valid' : 'invalid'}`);
      setLoading(false);
      setToastOpen(true);
    }, 100);
  };

  useEffect(() => {
    if (!credentials.length) return;
    setIsSelectModalOpen(true);
  }, [credentials]);

  useEffect(() => {
    if (!selectedCredentials.length) return;

    sendAuthorizationResponse().catch((e) => console.log(e));
  }, [selectedCredentials]);

  return (
    <div className="flex h-full justify-center sm:h-fit">
      <div className="dark:bg-navy-blue-800 flex h-full min-h-[50vh] w-full justify-center rounded-3xl bg-white shadow-lg">
        <ConnectedProvider>
          {isAuthorizationResponseValid === null && (
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
                    placeholder="Authorization Request URI"
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
          )}
          {/* Show response validity and error if present */}
          {isAuthorizationResponseValid !== null && (
            <div className="flex w-full flex-col items-center p-8">
              <div className="mb-8">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAuthorizationResponseValid(null);
                    setAuthorizationResponseError(null);
                  }}
                >
                  Reset
                </Button>
              </div>
              <div className="flex w-full flex-row items-center justify-center p-4">
                <div className="text-xl font-bold">
                  Authorization Response is:
                </div>
                <div
                  className={`pl-2 text-xl font-bold ${
                    isAuthorizationResponseValid
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {isAuthorizationResponseValid ? 'Valid' : 'Invalid'}
                </div>
              </div>
              {authorizationResponseError && (
                <div className="flex flex-col items-center space-y-2 p-4">
                  <div className="text-xl font-bold">Error:</div>
                  <div className="text-md font-bold text-red-500">
                    {authorizationResponseError}
                  </div>
                </div>
              )}
            </div>
          )}
        </ConnectedProvider>
      </div>
      <SelectCredentialsModal
        open={isSelectModalOpen}
        setOpen={setIsSelectModalOpen}
        credentials={credentials}
        selectCredentials={setSelectedCredentials}
      />
    </div>
  );
}
