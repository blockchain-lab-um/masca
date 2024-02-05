import { ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { VerifiablePresentation } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import { convertTypes } from '@/utils/string';
import { Database } from '@/utils/supabase/database.types';
import { FormatedView } from './formatedView';

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

  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="max-w-full flex-1 md:max-w-3xl">
        {view === 'Normal' && (
          <FormatedView
            credential={credentials[parseInt(page, 10) - 1]}
            holder={presentation.holder}
            expirationDate={presentation.expirationDate}
            issuanceDate={presentation.issuanceDate}
            page={page}
            total={credentials.length ?? 1}
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
  const headersList = headers();
  const referrer = headersList.get('referer');
  let url = null;
  if (!presentation) return {};
  if (referrer) {
    const parsedUrl = new URL(referrer);
    url = `${parsedUrl.protocol}//${parsedUrl.host}`;
  }
  const finallyUrl =
    process.env.NEXT_PUBLIC_APP_URL || url || 'https://masca.io';

  const ogUrl = new URL(`${finallyUrl}/api/og`);
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
      credential = JSON.parse(presentation.verifiableCredential[0]);
    }

    const types = convertTypes((credential as any).type);

    if (typeof (credential as any).issuer === 'string') {
      ogUrl.searchParams.set('credentialIssuer', (credential as any).issuer);
    } else {
      ogUrl.searchParams.set('credentialIssuer', (credential as any).issuer.id);
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
    title: 'Share presentation',
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
      title: 'Share Presentation',
      description: 'Page for displaying shared presentations',
      images: [ogUrl.toString()],
    },
  };
}
