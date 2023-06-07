import { Metadata } from 'next';

import CreatePresentationDisplay from '@/components/CreatePresentationDisplay';

export const metadata: Metadata = {
  title: 'Create Verifiable Presentation',
  description:
    'Page to create a Verifiable Presentation from selected Verifiable Credentials.',
};

export default function Page() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full max-w-sm rounded-3xl bg-white shadow-lg md:max-w-md lg:max-w-xl xl:max-w-[40rem]">
          <CreatePresentationDisplay />
        </div>
      </div>
    </>
  );
}
