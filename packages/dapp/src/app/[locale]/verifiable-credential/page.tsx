import { Metadata } from 'next';

import CredentialDisplay from '@/components/CredentialDisplay';

export const metadata: Metadata = {
  title: 'Verifiable Credential',
  description: 'Page to view a Verifiable Credential.',
};

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:w-[50rem] xl:max-w-[50rem]">
        <CredentialDisplay />
      </div>
    </div>
  );
}
