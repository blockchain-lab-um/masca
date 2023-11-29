'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/react';
import { VerifiableCredential } from '@veramo/core';

import FormatedPanel from '@/components/CredentialDisplay/FormatedPanel';
import { DIDDisplay } from '@/components/DIDDisplay';

export const FormatedView = ({
  credential,
  holder,
  issuanceDate,
  page,
  total,
}: {
  credential: VerifiableCredential;
  holder: string;
  issuanceDate: string | undefined;
  page: string;
  total: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <div className="flex justify-start">
        <Pagination
          loop
          showControls
          color="success"
          total={total}
          initialPage={parseInt(page, 10)}
          onChange={(val) => {
            const params = new URLSearchParams(window.location.search);
            params.set('page', val.toString());
            params.set('view', 'normal');
            router.replace(`${pathname}?${params.toString()}`);
          }}
        />
      </div>
      <div className="dark:bg-navy-blue-800 mt-4 h-full w-full rounded-3xl bg-white p-6 shadow-lg">
        <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 mb-4 flex max-w-full items-center space-x-4 rounded-2xl bg-gradient-to-b from-orange-100 to-pink-100 px-4 py-6 shadow-md">
          <div className="flex">
            <h2 className="dark:text-navy-blue-200 font-b old pr-2 text-gray-800">
              Holder:
            </h2>
            <DIDDisplay did={holder} />
          </div>
          {issuanceDate && (
            <div className="flex">
              <h2 className="dark:text-navy-blue-200 font-b old pr-2 text-gray-800">
                Issuance date:
              </h2>
              {new Date(Date.parse(issuanceDate)).toDateString()}
            </div>
          )}
        </div>
        <FormatedPanel credential={credential} />
      </div>
    </>
  );
};
