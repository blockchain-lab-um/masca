import { Metadata } from 'next';

import ConnectedProvider from '@/components/ConnectedProvider';
import GetCredential from '@/components/GetCredential';

export const metadata: Metadata = {
  title: 'Get Credential',
  description:
    'User interface to get a credential using OIDC Credential Offer URI.',
};

export default async function Page() {
  return (
    <div className="flex h-full justify-center sm:h-fit">
      <div className="dark:bg-navy-blue-800 flex h-full min-h-[50vh] w-full justify-center rounded-3xl bg-white shadow-lg">
        <ConnectedProvider>
          <GetCredential />
        </ConnectedProvider>
      </div>
    </div>
  );
}
