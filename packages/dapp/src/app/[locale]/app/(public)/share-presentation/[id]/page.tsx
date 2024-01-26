import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { VerifiablePresentation } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import { Database } from '@/utils/supabase/database.types';
import { FormatedView } from './formatedView';

export const revalidate = 0;

const getPresentation = async (id: string): Promise<VerifiablePresentation> => {
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
  return presentation;
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
  const presentation = await getPresentation(id);
  const credentials = presentation.verifiableCredential
    ? presentation.verifiableCredential.map(decodeCredentialToObject)
    : [];
  const page = searchParams.page ?? '1';
  const view = searchParams.view ?? 'Normal';

  return (
    <div className="flex items-start justify-center flex-1 w-full">
      <div className="flex-1 max-w-full md:max-w-3xl">
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
          <div className="w-full h-full p-6 bg-white shadow-lg dark:bg-navy-blue-800 rounded-3xl">
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
  const presentation = await getPresentation(id);

  if (!presentation) return {};

  // const url = process.env.NEXT_PUBLIC_APP_URL ?? 'https://masca.io';
  const url = 'http://localhost:3000';

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set('type', 'share-presentation');
  ogUrl.searchParams.set('holder', presentation.holder);
  ogUrl.searchParams.set(
    'numberOfCredentials',
    (presentation.verifiableCredential?.length ?? 0).toString()
  );
  ogUrl.searchParams.set('method', presentation.proof.type ?? 'unknown');

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
