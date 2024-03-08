import { createClient } from '@supabase/supabase-js';
import { VerifiablePresentation } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';
import { normalizeCredential } from 'did-jwt-vc';
import { notFound } from 'next/navigation';

import { getAgent } from '@/app/api/veramoSetup';
import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import { convertTypes } from '@/utils/string';
import { Database } from '@/utils/supabase/database.types';
import { FormattedView } from './formattedView';

export const revalidate = 0;

interface ReturnPresentation {
  presentation: VerifiablePresentation;
  title: string;
}

const getPresentation = async (id: string): Promise<ReturnPresentation> => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Query the presentation
  const { data, error } = await supabase
    .from('presentations')
    .select()
    .eq('id', id)
    .limit(1);

  if (error) {
    throw new Error('Failed to fetch presentation');
  }

  if (!data || data.length === 0) {
    return notFound();
  }

  // Update views
  await supabase
    .from('presentations')
    .update({ views: data[0].views + 1 })
    .eq('id', id);

  const presentation = data[0].presentation as VerifiablePresentation;
  const { title } = data[0];
  return { presentation, title };
};

const verifyPresentation = async (presentation: VerifiablePresentation) => {
  const agent = await getAgent();

  const result = await agent.verifyPresentation({
    presentation,
  });

  return result;
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
  const { presentation } = await getPresentation(id);
  const credentials = presentation.verifiableCredential
    ? presentation.verifiableCredential.map(decodeCredentialToObject)
    : [];
  const page = searchParams.page ?? '1';
  const view = searchParams.view ?? 'Normal';

  const verificationResult = await verifyPresentation(presentation);

  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="max-w-full flex-1 md:max-w-3xl">
        {view === 'Normal' && (
          <FormattedView
            credential={credentials[parseInt(page, 10) - 1]}
            holder={presentation.holder}
            expirationDate={presentation.expirationDate}
            issuanceDate={presentation.issuanceDate}
            page={page}
            total={credentials.length ?? 1}
            verificationResult={verificationResult}
          />
        )}
        {view === 'Json' && (
          <div className="dark:bg-navy-blue-800 h-full w-full rounded-3xl bg-white p-6 shadow-lg">
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
  const { presentation, title } = await getPresentation(id);
  if (!presentation) return {};
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://masca.io';
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
