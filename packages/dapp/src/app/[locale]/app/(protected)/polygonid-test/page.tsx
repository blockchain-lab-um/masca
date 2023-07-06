'use client';

import { useMascaStore } from '@/stores';

export default async function Page() {
  const api = useMascaStore((state) => state.mascaApi);

  const handleTestCredentialOffer = async () => {
    if (!api) return;

    api
      .handlePolygonCredentialOffer({
        credentialOfferMessage: '',
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleTestAuthorizationRequest = async () => {
    if (!api) return;

    api
      .handlePolygonAuthorizationRequest({
        authorizationRequestMessage: '',
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  return (
    <div className="dark:bg-navy-blue-800 flex flex-1 rounded-3xl bg-white shadow-lg">
      <h1>Polygon test page</h1>
      <div className="flex">
        <button onClick={handleTestCredentialOffer}>
          Test Credential Offer
        </button>
        <button onClick={handleTestAuthorizationRequest}>
          Test Authorization Request
        </button>
      </div>
    </div>
  );
}
