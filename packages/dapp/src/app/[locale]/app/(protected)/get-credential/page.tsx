import { Metadata } from 'next';

import GetCredential from '@/components/GetCredential';

export const metadata: Metadata = {
  title: 'Get Credentials',
  description:
    'User interface to get a credential using OIDC Credential Offer URI.',
};

export default async function Page() {
  return (
    <div className="dark:bg-navy-blue-800 flex flex-1 rounded-3xl bg-white shadow-lg">
      <GetCredential />
    </div>
  );
}
