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
    <div className="flex flex-1 items-start justify-center">
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-[50rem]">
        <CredentialDisplay id={slug} />
      </div>
    </div>
  );
}
