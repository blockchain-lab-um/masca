'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

import { useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import Button from '../Button';

export const SignInModal = () => {
  const t = useTranslations('SignInModal');
  const { signMessage } = useSignMessage();
  const { address } = useAccount();

  // Local state
  const [loading, setLoading] = useState(false);

  // Global state
  const {
    isSignInModalOpen,
    changeToken,
    changeIsSignedIn,
    changeIsSignInModalOpen,
  } = useAuthStore((state) => ({
    isSignInModalOpen: state.isSignInModalOpen,

    changeToken: state.changeToken,
    changeIsSignedIn: state.changeIsSignedIn,
    changeIsSignInModalOpen: state.changeIsSignInModalOpen,
  }));

  // Functions
  const getNonce = async () => {
    const response = await fetch('/api/siwe/nonce', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to get nonce.');

    const data = await response.json();

    if (!data.nonce) throw new Error('Failed to get nonce.');

    return data as {
      nonce: string;
      expiresAt: string;
      createdAt: string;
    };
  };

  const createSiweMessage = async () => {
    const { nonce } = await getNonce();

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to masca.io',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: nonce.replaceAll('-', ''),
    });

    return message.prepareMessage();
  };

  const handleSignInWithEthereum = async () => {
    setLoading(true);
    const message = await createSiweMessage();
    signMessage(
      { message },
      {
        onSuccess: async (signature) => {
          const response = await fetch('/api/siwe/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature }),
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to sign in.');

          const data = await response.json();

          if (!data.jwt) throw new Error('Failed to sign in.');

          // Set data
          changeToken(data.jwt);
          changeIsSignedIn(true);
          Cookies.set(`token-${address}`, data.jwt);

          // Close modal and show toast
          changeIsSignInModalOpen(false);
          setTimeout(() => {
            useToastStore.setState({
              open: true,
              title: t('sign-in-success'),
              type: 'success',
              loading: false,
              link: null,
            });
          }, 200);
        },
        onError: (error) => {
          setTimeout(() => {
            useToastStore.setState({
              open: true,
              title: t('sign-in-error'),
              type: 'error',
              loading: false,
              link: null,
            });
          }, 200);
        },
      }
    );
  };

  return (
    <Modal
      backdrop="blur"
      size="xl"
      isOpen={isSignInModalOpen}
      onClose={() => changeIsSignInModalOpen(false)}
      hideCloseButton={true}
      placement="center"
      className="main-bg mx-4 py-2"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="text-h3 font-ubuntu dark:text-navy-blue-50 w-full text-center font-medium leading-6 text-gray-900">
                {t('title')}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="mt-8 w-full">
                <div className="flex w-full justify-center">
                  <p className="text-md dark:text-navy-blue-200 max-w-sm text-center text-gray-700">
                    {t('description')}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-center">
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleSignInWithEthereum().finally(() =>
                        setLoading(false)
                      )
                    }
                    loading={loading}
                    disabled={loading}
                  >
                    {t('sign-in-with-ethereum')}
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <div className="mt-10">
                    <Button
                      onClick={() => changeIsSignInModalOpen(false)}
                      variant="cancel"
                      size="xs"
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
