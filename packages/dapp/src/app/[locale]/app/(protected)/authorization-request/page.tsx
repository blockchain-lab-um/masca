import type { Metadata } from 'next';

import AuthorizationRequestFlow from '@/components/AuthorizationRequest';

export const metadata: Metadata = {
  title: 'Authorization Request',
  description:
    'User interface to initiate the authorization flow using an OIDC Authorization Request URI.',
};

export default function Page() {
  return (
    <div className="dark:bg-navy-blue-800 flex flex-1 rounded-3xl bg-white shadow-lg">
      <AuthorizationRequestFlow />
    </div>
  );
}
