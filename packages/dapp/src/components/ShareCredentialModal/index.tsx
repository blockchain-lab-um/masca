import { useEffect, useMemo, useState } from 'react';
import {
  isError,
  Result,
  ResultObject,
} from '@blockchain-lab-um/masca-connector';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
} from '@nextui-org/react';
import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { selectProofFormat } from '@/utils/selectProofFormat';
import { convertTypes } from '@/utils/string';
import { useMascaStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import Button from '../Button';

interface ShareCredentialModalProps {
  isOpen: boolean;
  credentials: VerifiableCredential[];
  setOpen: (isOpen: boolean) => void;
}

export const ShareCredentialModal = ({
  isOpen,
  credentials,
  setOpen,
}: ShareCredentialModalProps) => {
  const t = useTranslations('ShareCredentialModal');

  // Global state
  const { api, didMethod } = useMascaStore((state) => ({
    api: state.mascaApi,
    didMethod: state.currDIDMethod,
  }));
  const token = useAuthStore((state) => state.token);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');

  const types = useMemo(
    () =>
      credentials.map((credential) => ({
        key: credential.id,
        value: convertTypes(credential.type).split(',')[0],
      })),
    [credentials]
  );

  const supportedDidMethod = useMemo(
    () => !['did:polygonid', 'did:iden3', undefined].includes(didMethod),
    [didMethod]
  );

  const supportedCredentials = useMemo(() => {
    for (const credential of credentials) {
      if (
        typeof credential.issuer === 'string' &&
        (credential.issuer.includes('polygon') ||
          credential.issuer.includes('iden3'))
      ) {
        return false;
      }

      if (
        typeof credential.credentialSubject === 'object' &&
        credential.credentialSubject.id &&
        (credential.credentialSubject.id.includes('polygon') ||
          credential.credentialSubject.id.includes('iden3'))
      ) {
        return false;
      }
    }

    return true;
  }, [credentials]);

  const stringifiedTypes = useMemo(() => JSON.stringify(types), [types]);

  // Functions
  const handleShareCredential = async () => {
    if (!api || !didMethod) return;

    setIsLoading(true);
    let createPresentationResult: Result<VerifiablePresentation>;
    try {
      createPresentationResult = await api.createPresentation({
        vcs: credentials,
        proofFormat: selectProofFormat(didMethod),
      });
    } catch (e: any) {
      console.log(e);
      createPresentationResult = ResultObject.error(e.message);
    }

    if (isError(createPresentationResult)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('create-presentation-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      console.log(createPresentationResult.error);
      return;
    }

    const presentation = createPresentationResult.data;

    if (!token) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('please-sign-in'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    const shareResponse = await fetch('/api/share/presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        presentation,
        title,
      }),
    });

    try {
      const result = await shareResponse.json();

      if (!result.presentationId)
        throw new Error('Failed to share presentation');

      setShareLink(
        `${window.location.origin}/app/share-presentation/${result.presentationId}`
      );
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('share-presentation-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  useEffect(() => {
    setShareLink(null);
  }, [stringifiedTypes]);

  return (
    <Modal
      backdrop="blur"
      size="4xl"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
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
              <p className="text-md dark:text-navy-blue-200 text-center text-gray-600">
                {t('description')}
              </p>
              {supportedDidMethod && supportedCredentials && (
                <div className="mt-6">
                  {!shareLink && (
                    <div>
                      <div>
                        <div className="justify-center">
                          <Input
                            variant="bordered"
                            labelPlacement="outside"
                            maxLength={16}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            classNames={{
                              inputWrapper: clsx(
                                'shadow-none outline-none',
                                'bg-unset',
                                'group-data-[focus=true]:border-pink-500 dark:group-data-[focus=true]:border-orange-accent-dark'
                              ),
                              label:
                                'text-xl group-data-[filled-within=true]:text-pink-500 dark:group-data-[filled-within=true]:text-orange-accent-dark',
                              input: 'dark:bg-navy-blue-900 bg-white',
                            }}
                            label={t('label')}
                            placeholder={t('placeholder')}
                          />
                        </div>
                        <div className="mt-6 flex flex-col space-y-2">
                          <h3 className="dark:text-orange-accent-dark text-xl text-pink-500">
                            {t('selected')}
                          </h3>
                          <div className="flex flex-col space-y-2">
                            {types.map(({ key, value }) => (
                              <div key={key}>{value}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {shareLink && (
                    <div className="flex flex-col">
                      <Snippet
                        hideSymbol
                        classNames={{
                          base: 'bg-gray-100 dark:bg-navy-blue-800',
                          symbol: 'bg-gray-100 dark:bg-navy-blue-800',
                          copyButton:
                            'text-pink-500 dark:text-orange-accent-dark',

                          pre: 'truncate',
                        }}
                      >
                        {shareLink}
                      </Snippet>
                    </div>
                  )}
                </div>
              )}
              {!supportedDidMethod && (
                <div className="mt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="dark:text-orange-accent-dark text-xl text-pink-500">
                      {t('unsupported-method-title')}
                    </h3>
                    <div className="flex flex-col space-y-2">
                      {t('unsupported-method-description')}
                    </div>
                  </div>
                </div>
              )}
              {!supportedCredentials && (
                <div className="mt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="dark:text-orange-accent-dark text-xl text-pink-500">
                      {t('unsupported-credentials-title')}
                    </h3>
                    <div className="flex flex-col space-y-2">
                      {t('unsupported-credentials-description')}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-10 flex w-full justify-end">
                <Button
                  variant="cancel"
                  size="xs"
                  onClick={() => setOpen(false)}
                >
                  {t('cancel')}
                </Button>
                {!shareLink && supportedDidMethod && supportedCredentials && (
                  <Button
                    disabled={isLoading}
                    loading={isLoading}
                    variant="warning"
                    size="xs"
                    onClick={() =>
                      handleShareCredential().finally(() => setIsLoading(false))
                    }
                  >
                    {t('confirm')}
                  </Button>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
