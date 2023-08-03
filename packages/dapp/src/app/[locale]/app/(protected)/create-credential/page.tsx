import { Metadata } from 'next';

import CreateCredentialDisplay from '@/components/CreateCredentialDisplay';

export const metadata: Metadata = {
  title: 'Create Credential',
  description: 'Page for creating a credential.',
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 w-full max-w-md flex-col justify-center rounded-3xl bg-white shadow-lg md:max-w-lg lg:max-w-xl xl:max-w-[46rem]">
        <CreateCredentialDisplay />
      </div>
    </div>
  );
}
