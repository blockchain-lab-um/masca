import { Metadata } from 'next';

import AuthorizationRequestFlow from '@/components/AuthorizationRequest';

export const metadata: Metadata = {
  title: 'Authorization Request',
  description:
    'User interface to initiate the authorization flow using an OIDC Authorization Request URI.',
};

export default function Page() {
  return (
    <div className="flex h-full justify-center sm:h-fit">
      <div className="dark:bg-navy-blue-800 flex h-full min-h-[50vh] w-full justify-center rounded-3xl bg-white shadow-lg">
        <AuthorizationRequestFlow />
      </div>
    </div>
  );
}
