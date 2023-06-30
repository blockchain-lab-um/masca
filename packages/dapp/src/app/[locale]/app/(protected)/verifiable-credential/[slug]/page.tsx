import { Metadata } from 'next';

import CredentialDisplay from '@/components/CredentialDisplay';

export const metadata: Metadata = {
  title: 'Verifiable Credential',
  description: 'Page to view a Verifiable Credential.',
};

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="flex-1 md:max-w-3xl">
        <CredentialDisplay id={slug} />
      </div>
    </div>
  );
}
