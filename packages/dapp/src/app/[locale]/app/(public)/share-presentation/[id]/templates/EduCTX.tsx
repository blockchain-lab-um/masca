import type { VerifiableCredential } from '@veramo/core';
import { DisplayDate } from '../DisplayDate';
import { DisplayText } from '../DisplayText';
import { DIDDisplay } from '@/components/DIDDisplay';

const CredentialSubject = ({
  data,
}: {
  data: Record<string, any>;
}) => (
  <>
    <DisplayText text="Given Name" value={data?.currentGivenName} />
    <DisplayText text="Family Name" value={data?.currentFamilyName} />
    <DisplayText text="Achieved" value={data?.achieved?.title} />
    <DisplayDate
      text="Specified by"
      date={data?.achieved?.specifiedBy?.title}
    />
    <DisplayText
      text="Grade"
      value={data?.achieved?.wasDerivedFrom?.grade}
      tooltip={data?.achieved?.wasDerivedFrom?.title}
    />
  </>
);

type EduCTXProps = {
  credential: VerifiableCredential;
  title: {
    subject: string;
    issuer: string;
    dates: string;
  };
};

export const EduCTX = ({ credential, title }: EduCTXProps) => {
  return (
    <div className="flex flex-col space-y-8 px-6 md:flex-row md:space-x-16 md:space-y-0">
      <div className="flex w-full flex-col items-start space-y-2 md:max-w-[50%]">
        <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
          {title.subject}
        </h1>
        <CredentialSubject data={credential.credentialSubject} />
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-start justify-center space-y-2 ">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {title.issuer}
            </h1>
            <DisplayText
              text={'Awarding body'}
              value={
                credential.credentialSubject?.achieved?.wasAwardedBy
                  ?.awardingBody
              }
              tooltip={
                credential.credentialSubject?.achieved?.wasAwardedBy
                  ?.awardingBodyDescription
              }
            />
            <div className="flex flex-col space-y-0.5">
              <div className="flex">
                <DIDDisplay
                  did={
                    typeof credential.issuer === 'string'
                      ? credential.issuer
                      : credential.issuer.id
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-2">
            <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
              {title.dates}
            </h1>
            <DisplayDate text="Issuance date" date={credential.issuanceDate} />
            {credential.credentialSubject?.achieved?.wasAwardedBy
              ?.awardingDate && (
              <DisplayDate
                text="Awarding date"
                date={
                  credential.credentialSubject?.achieved?.wasAwardedBy
                    ?.awardingDate
                }
              />
            )}
            {credential.expirationDate && (
              <DisplayDate
                text="Expiration date"
                date={credential.expirationDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
