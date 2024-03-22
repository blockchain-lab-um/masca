import type { Metadata } from 'next';

import CreateCredentialDisplay from '@/components/CreateCredentialDisplay';

export const metadata: Metadata = {
  title: 'Create Credential',
  description: 'Page for creating a credential.',
};

export default function Page() {
  return (
    <div className="flex h-full flex-1 justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-4xl">
        <CreateCredentialDisplay />
      </div>
    </div>
  );
}
