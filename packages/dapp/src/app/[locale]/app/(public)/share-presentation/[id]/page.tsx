import { decodeCredentialToObject } from '@veramo/utils';
import { normalizeCredential } from 'did-jwt-vc';
import { notFound } from 'next/navigation';

import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import { convertTypes } from '@/utils/string';
import { FormattedView } from './FormattedView';
import { usePresentation, useUpdatePresentationViews } from '@/hooks';
import { NormalViewButton } from './NormalViewButton';
import { VerificationService } from '@blockchain-lab-um/extended-verification';
import type { VerifiablePresentation } from '@veramo/core';

export const revalidate = 0;

const verifyPresentation = async (presentation: VerifiablePresentation) => {
  await VerificationService.init();
  return VerificationService.verify(presentation);
};

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    view: 'Normal' | 'Json';
    page: string | undefined;
  };
}) {
  const { data } = await usePresentation(id);

  if (!data) {
    return notFound();
  }

  await useUpdatePresentationViews(id);

  const verificationResult = await verifyPresentation(data.presentation);

  const { presentation } = data;

  const credentials = presentation.verifiableCredential
    ? presentation.verifiableCredential.map(decodeCredentialToObject)
    : [];
  const page = searchParams.page ?? '1';
  const view = searchParams.view ?? 'Normal';

  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="max-w-full flex-1 md:max-w-3xl">
        {view === 'Normal' && (
          <FormattedView
            credential={credentials[Number.parseInt(page, 10) - 1]}
            presentation={presentation}
            page={page}
            total={credentials.length ?? 1}
            verificationResult={verificationResult}
          />
        )}
        {view === 'Json' && (
          <div className="dark:bg-navy-blue-800 h-full w-full rounded-3xl bg-white p-6 shadow-lg">
            <NormalViewButton />
            <JsonPanel data={presentation} />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    view: 'Normal' | 'Json';
    page: string | undefined;
  };
}) {
  const { data } = await usePresentation(id);

  // If the presentation is not found, return an empty as the metadata
  if (!data) return {};

  const { presentation, title } = data;

  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://masca.io';

  // Create the OpenGraph Image URL
  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set('type', 'share-presentation');
  ogUrl.searchParams.set('holder', presentation.holder);
  ogUrl.searchParams.set(
    'numberOfCredentials',
    (presentation.verifiableCredential?.length ?? 0).toString()
  );
  ogUrl.searchParams.set('title', title);

  if (presentation.verifiableCredential?.length === 1) {
    let credential = presentation.verifiableCredential[0];
    if (typeof presentation.verifiableCredential[0] === 'string') {
      try {
        credential = JSON.parse(presentation.verifiableCredential[0]);
      } catch (e) {
        try {
          credential = normalizeCredential(
            presentation.verifiableCredential[0]
          );
        } catch (ex) {
          console.error(ex);
        }
      }
    }

    const types = convertTypes((credential as any).type);

    if (typeof (credential as any).issuer === 'string') {
      ogUrl.searchParams.set(
        'credentialIssuer',
        (credential as any).issuer ?? 'Unknown'
      );
    } else {
      ogUrl.searchParams.set(
        'credentialIssuer',
        (credential as any).issuer.id ?? 'Unknown'
      );
    }

    if (types.split(', ')[0] === 'Education Credential') {
      ogUrl.searchParams.set(
        'credentialIssuer',
        (credential as any).credentialSubject.achieved.wasAwardedBy
          .awardingBody ?? 'Unknown'
      );

      ogUrl.searchParams.set(
        'credentialTitle',
        (credential as any).credentialSubject.achieved.title ?? 'missing'
      );
    }
    ogUrl.searchParams.set('credentialType', types);
    ogUrl.searchParams.set(
      'credentialSubject',
      (credential as any).credentialSubject.id
    );
    ogUrl.searchParams.set(
      'credentialIssuanceDate',
      (credential as any).issuanceDate
    );
  }
  return {
    title: 'My Shared Credentials',
    description: 'Page for displaying shared presentations',
    openGraph: {
      type: 'article',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: 'Presentation Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Check out my shared credentials',
      description: 'Page for displaying shared presentations',
      images: [ogUrl.toString()],
    },
  };
}
