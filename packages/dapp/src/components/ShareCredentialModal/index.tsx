import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { VerifiablePresentation } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import {
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { selectProofFormat } from '@/utils/selectProofFormat';
import { convertTypes } from '@/utils/string';
import { useMascaStore, useToastStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { useShareModalStore } from '@/stores/shareModalStore';
import Button from '../Button';

const HeySVG = (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="hey-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <path
          d="M139.498 181.952C132.821 181.952 127.368 187.377 127.368 194.021V221.436C127.368 228.08 132.821 233.505 139.498 233.505C146.176 233.505 151.628 228.08 151.628 221.436V194.021C151.628 187.377 146.205 181.952 139.498 181.952Z"
          fill="black"
        />
        <path
          d="M214.985 208.559C211.93 209.406 204.262 211.128 200.149 211.128C195.625 211.128 187.723 209.23 185.314 208.559C182.141 207.683 178.851 208.092 176.031 209.697C173.181 211.303 171.154 213.901 170.273 217.024C169.391 220.147 169.803 223.445 171.418 226.247C173.034 229.078 175.649 231.092 178.792 231.939C179.291 232.085 191.307 235.383 200.149 235.383C208.992 235.383 221.007 232.085 221.507 231.939C227.999 230.158 231.818 223.474 230.026 216.995C228.234 210.544 221.507 206.749 214.985 208.53V208.559Z"
          fill="black"
        />
        <path
          d="M260.795 181.952C267.472 181.952 272.925 187.377 272.925 194.021V221.436C272.925 228.08 267.472 233.505 260.795 233.505C254.117 233.505 248.665 228.08 248.665 221.436V194.021C248.665 187.377 254.088 181.952 260.795 181.952Z"
          fill="black"
        />
      </mask>
    </defs>

    <path
      mask="url(#hey-mask)"
      d="M327.597 48.7755C310.325 47.4894 292.325 52.4789 276.126 65.5959C275.805 65.8556 275.319 65.6513 275.279 65.2404C273.317 44.7691 264.206 28.8039 251.073 17.7748C236.846 5.82683 218.305 0.00012207 199.996 0.00012207C181.688 0.00012207 163.147 5.82683 148.92 17.7748C135.788 28.8026 126.678 44.7651 124.714 65.2328C124.675 65.6435 124.188 65.8478 123.868 65.5883C107.659 52.4772 89.6563 47.4938 72.3844 48.7852C53.668 50.1845 36.3526 58.9 23.4242 71.5539C10.495 84.2085 1.61609 101.131 0.198617 119.388C-1.23201 137.815 4.9883 157.111 21.3806 174.035L21.3926 174.047C22.8845 175.58 24.3994 177.104 25.9374 178.617L25.9537 178.633C33.9143 186.42 42.1549 193.374 50.5252 199.586C50.8015 199.791 50.8015 200.205 50.5252 200.41C42.1561 206.62 33.9169 213.572 25.9576 221.357C24.3937 222.877 22.8623 224.417 21.3635 225.976C4.97884 242.915 -1.23529 262.215 0.199947 280.642C1.62222 298.903 10.5069 315.823 23.4401 328.473C36.3724 341.123 53.6898 349.831 72.4034 351.225C89.6754 352.511 107.675 347.521 123.874 334.404C124.195 334.145 124.681 334.349 124.721 334.76C126.683 355.231 135.793 371.196 148.927 382.225C163.154 394.173 181.695 400 200.004 400C218.312 400 236.853 394.173 251.08 382.225C264.212 371.198 273.322 355.235 275.286 334.767C275.325 334.357 275.812 334.152 276.132 334.412C292.341 347.523 310.344 352.506 327.616 351.215C346.332 349.816 363.647 341.1 376.576 328.446C389.505 315.792 398.384 298.869 399.801 280.612C401.232 262.185 395.012 242.889 378.619 225.965L378.607 225.953C377.115 224.42 375.601 222.896 374.063 221.383L374.046 221.367C366.086 213.58 357.845 206.626 349.475 200.414C349.198 200.209 349.198 199.795 349.475 199.59C357.844 193.38 366.083 186.428 374.042 178.644C375.606 177.123 377.138 175.583 378.636 174.024C395.021 157.085 401.235 137.785 399.8 119.358C398.378 101.097 389.493 84.1771 376.56 71.5268C363.628 58.8775 346.31 50.169 327.597 48.7755Z"
    />
  </svg>
);

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
                            {types.map(({ key, value }, i) => (
                              <div key={i}>{value}</div>
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
                      title="Check out my credential on @masca_io"
                      hashtags={['masca', 'identity', 'credential']}
                      className="flex items-center justify-center gap-x-2"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <Link
                      href={`https://hey.xyz/?text=${encodeURIComponent(
                        `Check out my credential on Masca ${shareLink}`
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
                        `Check out my credential on Masca `
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
