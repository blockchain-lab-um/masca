import { DIDDisplay } from '@/components/DIDDisplay';
import { ImageLink } from '@/components/ImageLink';
import clsx from 'clsx';
import { Fragment } from 'react';
import { AddressDisplay } from '../AddressDisplay';
import { DisplayDate } from '../DisplayDate';
import type { SdJwtCredential } from '@blockchain-lab-um/masca-connector';

const CredentialSubject = ({
  data,
  viewJsonText,
  selectJsonData,
}: {
  data: Record<string, any>;
  viewJsonText: string;
  selectJsonData: React.Dispatch<React.SetStateAction<any>>;
}) => (
  <>
    {Object.entries(data).map(([key, value]: [string, any]) => {
      if (value === null || value === '') return null;
      return (
        <Fragment key={key}>
          {(() => {
            if (key === 'id') {
              return (
                <>
                  <div className="flex flex-col space-y-0.5">
                    <div className="flex">
                      <DIDDisplay did={value} />
                    </div>
                  </div>
                </>
              );
            }

            if (key === 'address') return <AddressDisplay address={value} />;
            if (key === 'image') return <ImageLink value={value} />;

            const isObject = typeof value === 'object';
            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
            return (
              <div
                className={clsx(
                  'flex w-full overflow-clip',
                  isObject ? 'items-center' : 'flex-col items-start space-y-0.5'
                )}
              >
                <h2 className="dark:text-navy-blue-200 pr-2 font-bold capitalize text-gray-800">
                  {formattedKey}:
                </h2>
                <div className="text-md dark:text-navy-blue-300 w-full truncate font-normal text-gray-700">
                  {isObject ? (
                    <button
                      type="button"
                      className="dark:border-navy-blue-300 dark:hover:border-navy-blue-400 dark:focus:ring-navy-blue-500 rounded-md border border-gray-300 px-2 py-0.5 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      onClick={() => selectJsonData(value)}
                    >
                      {viewJsonText}
                    </button>
                  ) : (
                    value
                  )}
                </div>
              </div>
            );
          })()}
        </Fragment>
      );
    })}
  </>
);

type SdJwtProps = {
  credential: SdJwtCredential;
  title: {
    subject: string;
    issuer: string;
    dates: string;
    disclosures: string;
  };
  viewJsonText: string;
  selectJsonData: (data: any) => void;
};

const DisclosureDetails = ({
  data,
  viewJsonText,
  selectJsonData,
}: {
  data: Record<string, any>;
  viewJsonText: string;
  selectJsonData: React.Dispatch<React.SetStateAction<any>>;
}) => (
  <>
    {Object.entries(data).map(([key, value]: [string, any]) => {
      if (value === null || value === '') return null;

      const isObject = typeof value === 'object';

      return (
        <Fragment key={key}>
          <div
            className={clsx(
              'flex w-full overflow-clip',
              isObject ? 'items-center' : 'flex-col items-start space-y-0.5'
            )}
          >
            <h2 className="dark:text-navy-blue-200 pr-2 font-bold capitalize text-gray-800">
              {value.key}:
            </h2>
            <div className="text-md dark:text-navy-blue-300 w-full truncate font-normal text-gray-700">
              {isObject ? (
                <button
                  type="button"
                  className="dark:border-navy-blue-300 dark:hover:border-navy-blue-400 dark:focus:ring-navy-blue-500 rounded-md border border-gray-300 px-2 py-0.5 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => selectJsonData(value)}
                >
                  {viewJsonText}
                </button>
              ) : (
                value
              )}
            </div>
          </div>
        </Fragment>
      );
    })}
  </>
);

export const SdJwt = ({
  credential,
  title,
  viewJsonText,
  selectJsonData,
}: SdJwtProps) => {
  return (
    <div className="flex flex-col space-y-8 px-6 md:flex-row md:space-x-16 md:space-y-0">
      <div className="flex w-full flex-col items-start space-y-8 md:max-w-[50%]">
        <div className="flex flex-col items-start space-y-2">
          <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
            {title.subject}
          </h1>
          <CredentialSubject
            data={credential.credentialSubject || {}}
            viewJsonText={viewJsonText}
            selectJsonData={selectJsonData}
          />
        </div>
        {credential.disclosures && credential.disclosures.length > 0 && (
          <div className="flex flex-col items-start space-y-2">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {title.disclosures}
            </h1>
            <DisclosureDetails
              data={credential.disclosures || {}}
              viewJsonText={viewJsonText}
              selectJsonData={selectJsonData}
            />
          </div>
        )}
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-start justify-center space-y-2">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {title.issuer}
            </h1>
            <div className="flex flex-col space-y-0.5">
              <div className="flex">
                <DIDDisplay did={credential.iss} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-2">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {title.dates}
            </h1>
            <DisplayDate
              text="Issuance date"
              date={new Date((credential.iat ?? 0) * 1000).toLocaleDateString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
