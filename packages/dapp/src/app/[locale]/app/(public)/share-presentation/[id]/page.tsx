import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { VerifiablePresentation } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import { Database } from '@/utils/supabase/database.types';
import { FormatedView } from './formatedView';
import { TabWrapper } from './tabsWrapper';

export const metadata: Metadata = {
  title: 'Share presentation',
  description: '',
};

const getPresentation = async (id: string): Promise<VerifiablePresentation> => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

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

  const presentation = data[0].presentation as VerifiablePresentation;
  return presentation;
};

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    view: 'normal' | 'json';
    page: string | undefined;
  };
}) {
  const presentation = await getPresentation(id);
  const credentials = presentation.verifiableCredential
    ? presentation.verifiableCredential.map(decodeCredentialToObject)
    : [];
  const page = searchParams.page ?? '1';
  const view = searchParams.view ?? 'normal';
  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="max-w-full flex-1 md:max-w-3xl">
        <TabWrapper
          view={view}
          FormatedView={
            <FormatedView
              credential={credentials[parseInt(page, 10) - 1]}
              holder={presentation.holder}
              issuanceDate={presentation.issuanceDate}
              page={page}
              total={credentials.length ?? 1}
            />
          }
          JsonView={
            <div className="dark:bg-navy-blue-800 h-full w-full rounded-3xl bg-white p-6 shadow-lg">
              <JsonPanel data={presentation} />
            </div>
          }
        />
      </div>
    </div>
  );
}
