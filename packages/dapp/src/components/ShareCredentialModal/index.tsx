import {
  type QueryCredentialsRequestResult,
  type Result,
  ResultObject,
  type SdJwtCredential,
  isError,
} from '@blockchain-lab-um/masca-connector';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
} from '@nextui-org/react';
import type { VerifiablePresentation } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { v4 as uuidv4 } from 'uuid';

import {
  useMascaStore,
  useToastStore,
  useAuthStore,
  useShareModalStore,
} from '@/stores';
import { selectProofFormat } from '@/utils/selectProofFormat';
import { convertTypes } from '@/utils/string';
import Button from '../Button';
import SelectedVcShareTableRow from './SelectedVcShareTableRow';

export const ShareCredentialModal = () => {
  const t = useTranslations('ShareCredentialModal');

  // Global state
  const { isOpen, setIsOpen, credentials, shareLink, setShareLink } =
    useShareModalStore((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      credentials: state.credentials,
      shareLink: state.shareLink,
      setShareLink: state.setShareLink,
    }));

  const { api, didMethod } = useMascaStore((state) => ({
    api: state.mascaApi,
    didMethod: state.currDIDMethod,
  }));
  const token = useAuthStore((state) => state.token);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>('');

  const [selectedCredentials, setSelectedCredentials] =
    useState<QueryCredentialsRequestResult[]>();
  const [selectedSdJwtDisclosures, setSelectedSdJwtDisclosures] = useState<
    string[]
  >([]);

  const types = useMemo(
    () =>
      credentials.map((credential) => ({
        data: credential,
        metadata: {
          id: credential.id || uuidv4(),
          type: convertTypes(credential.type).split(',')[0],
        },
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

  const stringifiedTypes = useMemo(
    () => JSON.stringify(types.map((type) => type.metadata.type)),
    [types]
  );

  // Functions
  const handleShareCredential = async () => {
    if (!api || !didMethod) return;
    setIsLoading(true);

    const selectedProofFormat = selectProofFormat(didMethod);

    let createPresentationResult: Result<
      VerifiablePresentation | SdJwtCredential[]
    >;

    const allCredentialsHaveEncoded = credentials.every(
      (credential: any) => typeof (credential as any).encoded === 'string'
    );

    const isSdJwt =
      selectedProofFormat === 'sd-jwt' &&
      (didMethod === 'did:jwk' || didMethod === 'did:key:jwk_jcs-pub') &&
      allCredentialsHaveEncoded;
    let vcs: { id: string; encodedVc: string }[] = [];
    if (isSdJwt) {
      // Preprocess credentials for creating SD-JWT presentation
      vcs = credentials.map((credential, index) => ({
        id: types[index].metadata.id,
        encodedVc: credential.encoded,
      }));
    }

    try {
      createPresentationResult = await api.createPresentation({
        vcs: isSdJwt ? vcs : credentials,
        proofFormat: selectedProofFormat,
        presentationFrame: selectedSdJwtDisclosures,
      });

      if (
        selectedProofFormat === 'sd-jwt' &&
        createPresentationResult.success
      ) {
        let presentationsArray: string[] = [];

        if ('presentations' in createPresentationResult.data) {
          presentationsArray = createPresentationResult.data.presentations.map(
            (presentation: { presentation: string }) =>
              presentation.presentation
          );
        }

        createPresentationResult = await api.decodeSdJwtPresentation({
          presentation: presentationsArray,
        });
      }
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

      if (!result.presentationId) {
        throw new Error(
          result.message === 'Invalid presentation'
            ? 'Invalid presentation'
            : 'Failed to share presentation'
        );
      }

      setShareLink(
        `${window.location.origin}/app/share-presentation/${result.presentationId}`
      );
    } catch (e) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title:
            (e as Error).message === 'Invalid presentation'
              ? t('share-error-invalid')
              : t('share-presentation-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  const handleDisclosureCheck = (id: string, key: string, checked: boolean) => {
    const disclosureString = `${id}/${key}`;
    if (checked) {
      setSelectedSdJwtDisclosures([
        ...selectedSdJwtDisclosures,
        disclosureString,
      ]);
    } else {
      setSelectedSdJwtDisclosures(
        selectedSdJwtDisclosures.filter((d) => d !== disclosureString)
      );
    }
  };

  useEffect(() => {
    setShareLink(null);
  }, [stringifiedTypes]);

  useEffect(() => {
    if (isOpen) {
      const initialSelectedCredentials = types.map((type) => ({
        data: type.data,
        metadata: type.metadata,
      }));
      setSelectedCredentials(initialSelectedCredentials);
    }
  }, [isOpen, types]);

  return (
    <Modal
      backdrop="blur"
      size="4xl"
      isOpen={isOpen}
      isDismissable={false}
      onClose={() => setIsOpen(false)}
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
                            maxLength={64}
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
                        <div className="mt-4">
                          <div className="font-ubuntu dark:text-navy-blue-100 dark:border-navy-blue-600 border-b border-gray-400 p-4 pb-5 text-xl font-medium text-gray-800">
                            {t('selected')}
                          </div>
                          <table className="w-full text-center text-sm">
                            <tbody className="text-md break-all text-gray-800">
                              {selectedCredentials?.map((vc) => (
                                <SelectedVcShareTableRow
                                  selectedSdJwtDisclosures={
                                    selectedSdJwtDisclosures
                                  }
                                  handleDisclosureCheck={handleDisclosureCheck}
                                  key={vc.metadata.id}
                                  vc={vc}
                                />
                              ))}
                            </tbody>
                          </table>
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

              {shareLink && (
                <div className="dark:text-navy-blue-100 mt-4 text-gray-800">
                  {t('share-link-description')}
                  <div className="mt-2 flex gap-x-2">
                    <LinkedinShareButton
                      url={shareLink}
                      className="flex items-center justify-center gap-x-2"
                    >
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <TwitterShareButton
                      url={shareLink}
                      title={`Check out my credential${
                        credentials.length > 1 ? 's' : ''
                      } on @masca_io!\n`}
                      hashtags={['masca', 'identity', 'credential']}
                      className="flex items-center justify-center gap-x-2"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <Link
                      href={`https://hey.xyz/?text=${encodeURIComponent(
                        `Check out my credential${
                          credentials.length > 1 ? 's' : ''
                        } on Masca!\n ${shareLink}\n`
                      )}&hashtags=${encodeURIComponent(
                        'Masca,Identity,Credential'
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/images/hey_icon.png"
                        alt="hey"
                        width={32}
                        height={32}
                      />
                    </Link>
                    <Link
                      href={`https://warpcast.com/~/compose?text=${encodeURIComponent(
                        `Check out my credential${
                          credentials.length > 1 ? 's' : ''
                        } on Masca!`
                      )}&embeds[]=${shareLink}`}
                      target="_blank"
                    >
                      <Image
                        src="/images/warpcast_icon.png"
                        alt="warpcast"
                        className="rounded-full"
                        width={32}
                        height={32}
                      />
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-10 flex w-full items-center justify-end">
                <Button
                  variant="cancel"
                  size="xs"
                  onClick={() => setIsOpen(false)}
                >
                  {t('cancel')}
                </Button>
                {!shareLink && supportedDidMethod && supportedCredentials && (
                  <Button
                    disabled={isLoading}
                    loading={isLoading}
                    variant="primary"
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
